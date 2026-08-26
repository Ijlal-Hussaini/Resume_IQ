import json
import logging
from typing import Any, Dict, List, Optional, Type, TypeVar
from pydantic import BaseModel

from .config import settings

logger = logging.getLogger("resumeiq.llm")

T = TypeVar("T", bound=BaseModel)


class LLMService:
    """Resilient LLM Service supporting Groq, Google Gemini, and seamless fallback."""

    def __init__(self):
        self._groq_client = None
        self._gemini_client = None
        self._init_clients()

    def _init_clients(self):
        """Initialize available LLM clients based on environment settings."""
        if settings.GROQ_API_KEY:
            try:
                from langchain_groq import ChatGroq
                self._groq_client = ChatGroq(
                    api_key=settings.GROQ_API_KEY,
                    model_name=settings.GROQ_MODEL,
                    temperature=0.1,
                    max_tokens=4096,
                )
                logger.info(f"Initialized Groq LLM client ({settings.GROQ_MODEL})")
            except Exception as e:
                logger.warning(f"Failed to initialize Groq client: {e}")

        if settings.GOOGLE_API_KEY:
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                self._gemini_client = ChatGoogleGenerativeAI(
                    google_api_key=settings.GOOGLE_API_KEY,
                    model=settings.GEMINI_MODEL,
                    temperature=0.1,
                    max_output_tokens=4096,
                )
                logger.info(f"Initialized Gemini LLM client ({settings.GEMINI_MODEL})")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini client: {e}")

    @property
    def active_provider_name(self) -> str:
        """Returns the active or preferred provider."""
        if settings.PREFERRED_PROVIDER == "groq" and self._groq_client:
            return "Groq (Llama-3.3-70b)"
        if settings.PREFERRED_PROVIDER == "gemini" and self._gemini_client:
            return "Google Gemini (2.0-Flash)"
        if self._groq_client:
            return "Groq (Llama-3.3-70b)"
        if self._gemini_client:
            return "Google Gemini (2.0-Flash)"
        return "Deterministic Fallback Engine (No API Keys Configured)"

    @property
    def available_providers(self) -> List[str]:
        providers = []
        if self._groq_client:
            providers.append("groq")
        if self._gemini_client:
            providers.append("gemini")
        if not providers:
            providers.append("deterministic_fallback")
        return providers

    def get_llm(self, preferred: Optional[str] = None):
        """Returns primary LLM or fallback."""
        pref = preferred or settings.PREFERRED_PROVIDER
        if pref == "groq" and self._groq_client:
            return self._groq_client
        if pref == "gemini" and self._gemini_client:
            return self._gemini_client
        return self._groq_client or self._gemini_client or None

    async def invoke(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Execute LLM invocation with automatic multi-provider fallback."""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        # Try Primary LLM
        primary = self.get_llm()
        if primary:
            try:
                response = await primary.ainvoke(messages)
                return response.content if hasattr(response, "content") else str(response)
            except Exception as e:
                logger.warning(f"Primary LLM invocation failed: {e}. Trying fallback...")

        # Try Secondary LLM if primary failed
        secondary = self._gemini_client if primary == self._groq_client else self._groq_client
        if secondary:
            try:
                response = await secondary.ainvoke(messages)
                return response.content if hasattr(response, "content") else str(response)
            except Exception as e:
                logger.error(f"Secondary LLM fallback invocation also failed: {e}")

        # If no LLM keys are configured or all calls fail, return an indicator
        return "System running in fallback mode. Please configure GROQ_API_KEY or GOOGLE_API_KEY in .env."

    async def extract_structured(
        self,
        schema: Type[T],
        prompt: str,
        system_prompt: Optional[str] = None,
        fallback_factory: Optional[Any] = None
    ) -> T:
        """
        Extracts structured Pydantic object from LLM with schema enforcement.
        Falls back smoothly if no LLM credentials are provided.
        """
        llm = self.get_llm()
        if llm:
            try:
                # Use LangChain's with_structured_output if available
                structured_llm = llm.with_structured_output(schema)
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                
                result = await structured_llm.ainvoke(messages)
                if isinstance(result, schema):
                    return result
                elif isinstance(result, dict):
                    return schema.model_validate(result)
            except Exception as e:
                logger.warning(f"Structured extraction via LangChain failed: {e}. Attempting JSON parse recovery...")
                try:
                    # Recovery: Ask for raw JSON matching schema
                    json_prompt = f"{prompt}\n\nStrict Requirement: Return ONLY a valid JSON object matching this schema:\n{json.dumps(schema.model_json_schema())}"
                    raw_text = await self.invoke(json_prompt, system_prompt)
                    # Clean markdown codeblocks if any
                    cleaned = raw_text.strip()
                    if "```json" in cleaned:
                        cleaned = cleaned.split("```json")[1].split("```")[0].strip()
                    elif "```" in cleaned:
                        cleaned = cleaned.split("```")[1].split("```")[0].strip()
                    parsed = json.loads(cleaned)
                    return schema.model_validate(parsed)
                except Exception as rec_err:
                    logger.error(f"JSON parse recovery failed: {rec_err}")

        # If no keys or errors occurred and fallback_factory exists, invoke fallback
        if fallback_factory:
            return fallback_factory()

        raise RuntimeError("No LLM provider available and no fallback provided for structured extraction.")


llm_service = LLMService()

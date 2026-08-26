import asyncio
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
                    max_retries=1,
                    timeout=25.0,
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
        """Returns the active or preferred provider with the actual model name."""
        if settings.PREFERRED_PROVIDER == "groq" and self._groq_client:
            return f"Groq ({settings.GROQ_MODEL})"
        if settings.PREFERRED_PROVIDER == "gemini" and self._gemini_client:
            return f"Google Gemini ({settings.GEMINI_MODEL})"
        if self._groq_client:
            return f"Groq ({settings.GROQ_MODEL})"
        if self._gemini_client:
            return f"Google Gemini ({settings.GEMINI_MODEL})"
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
        """Returns primary LLM or fallback (prioritizes high-throughput Groq)."""
        pref = preferred or settings.PREFERRED_PROVIDER
        if pref == "gemini" and self._gemini_client:
            return self._gemini_client
        if self._groq_client:
            return self._groq_client
        return self._gemini_client or None


    async def invoke(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Execute LLM invocation with automatic multi-provider fallback."""
        from langchain_core.messages import SystemMessage, HumanMessage
        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

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
        Extracts structured Pydantic object with dual-provider LLM fallback
        (Primary -> Secondary -> Heuristic recovery).
        """
        from langchain_core.messages import SystemMessage, HumanMessage
        clients_to_try = []
        primary = self.get_llm()
        if primary:
            clients_to_try.append(primary)
        secondary = self._gemini_client if primary == self._groq_client else self._groq_client
        if secondary and secondary not in clients_to_try:
            clients_to_try.append(secondary)

        for client in clients_to_try:
            try:
                # 1. Direct JSON extraction with schema (Universal, instant, no tool-calling 400s)
                json_prompt = f"""{prompt}

CRITICAL: Return ONLY a valid, raw JSON object matching this exact schema (no markdown wrapping if possible, or inside ```json ```):
{json.dumps(schema.model_json_schema())}"""
                messages = []
                if system_prompt:
                    messages.append(SystemMessage(content=system_prompt))
                messages.append(HumanMessage(content=json_prompt))

                raw_res = await asyncio.wait_for(client.ainvoke(messages), timeout=15.0)
                raw_text = raw_res.content if hasattr(raw_res, "content") else str(raw_res)
                cleaned = raw_text.strip()
                if "```json" in cleaned:
                    cleaned = cleaned.split("```json")[1].split("```")[0].strip()
                elif "```" in cleaned:
                    cleaned = cleaned.split("```")[1].split("```")[0].strip()
                
                # If there's leading/trailing text outside braces
                if "{" in cleaned and "}" in cleaned:
                    start_idx = cleaned.find("{")
                    end_idx = cleaned.rfind("}") + 1
                    cleaned = cleaned[start_idx:end_idx]

                parsed = json.loads(cleaned)
                return schema.model_validate(parsed)
            except Exception as json_err:
                logger.warning(f"Direct JSON schema extraction failed on client: {json_err}. Trying native structured output...")
                try:
                    # 2. Native with_structured_output fallback
                    structured_llm = client.with_structured_output(schema)
                    messages = []
                    if system_prompt:
                        messages.append(SystemMessage(content=system_prompt))
                    messages.append(HumanMessage(content=prompt))

                    result = await asyncio.wait_for(structured_llm.ainvoke(messages), timeout=15.0)
                    if isinstance(result, schema):
                        return result
                    elif isinstance(result, dict):
                        return schema.model_validate(result)
                except Exception as struct_err:
                    logger.warning(f"Structured extraction also failed on client: {struct_err}. Trying next client...")



        # If both LLMs were rate-limited or failed, execute fallback factory
        if fallback_factory:
            logger.info("Executing heuristic fallback factory for structured extraction.")
            return fallback_factory()

        raise RuntimeError("No LLM provider available and no fallback provided for structured extraction.")



llm_service = LLMService()

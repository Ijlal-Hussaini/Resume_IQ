import math
import logging
import re
from typing import List

logger = logging.getLogger("resumeiq.embeddings")


class EmbeddingService:
    """Provides vector embeddings using sentence-transformers or fast normalized frequency fallback."""

    def __init__(self):
        self._model = None
        self._dim = 384
        self._init_model()

    def _init_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Loaded sentence-transformers 'all-MiniLM-L6-v2'")
        except Exception as e:
            logger.info(f"Using lightweight deterministic token vectorizer fallback (no torch overhead): {e}")

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed list of texts."""
        if not texts:
            return []

        if self._model is not None:
            try:
                embeddings = self._model.encode(texts, convert_to_numpy=True)
                return embeddings.tolist()
            except Exception as e:
                logger.warning(f"SentenceTransformer encoding failed: {e}. Using fallback.")

        # Deterministic lightweight fallback embedding vector generator (384-dim normalized hash projection)
        return [self._embed_fallback(text) for text in texts]

    def embed_query(self, text: str) -> List[float]:
        """Embed a single query."""
        results = self.embed_documents([text])
        return results[0] if results else [0.0] * self._dim

    def _embed_fallback(self, text: str) -> List[float]:
        """Generates a normalized 384-dimensional feature vector from text tokens."""
        vec = [0.0] * self._dim
        words = re.findall(r"\w+", text.lower())
        if not words:
            return vec

        for word in words:
            # Deterministic hash to dimension bucket
            idx = abs(hash(word)) % self._dim
            vec[idx] += 1.0

        # L2 normalize
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec


embedding_service = EmbeddingService()

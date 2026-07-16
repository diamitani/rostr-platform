"""Settings API — user API key management (BYOK)."""

import base64
import os
import time

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth_utils import get_current_user

router = APIRouter()


# ── Simple encryption for user API keys (MVP) ───────────────────

def _get_server_secret() -> bytes:
    """Get the server secret for encrypting user keys."""
    secret = os.environ.get("SERVER_SECRET", "rostr-default-secret-change-me")
    # Derive 32 bytes for XOR cipher
    return (secret * 10)[:32].encode()


def _encrypt_key(plain_key: str) -> str:
    """Encrypt a user API key (simple XOR with server secret)."""
    secret = _get_server_secret()
    plain_bytes = plain_key.encode()
    encrypted = bytes(p ^ secret[i % len(secret)] for i, p in enumerate(plain_bytes))
    return base64.b64encode(encrypted).decode()


def _decrypt_key(encrypted_key: str) -> str:
    """Decrypt a user API key."""
    secret = _get_server_secret()
    encrypted_bytes = base64.b64decode(encrypted_key)
    decrypted = bytes(e ^ secret[i % len(secret)] for i, e in enumerate(encrypted_bytes))
    return decrypted.decode()


# ── Helper ──────────────────────────────────────────────────────

def get_user_api_key(user_id: str) -> str | None:
    """Get a user's custom API key (decrypted), or None if not set."""
    import sys, os as _os
    sys.path.insert(0, _os.path.join(_os.path.dirname(__file__), ".."))
    from db.database import get_db

    conn = get_db()
    row = conn.execute(
        "SELECT encrypted_key FROM user_api_keys WHERE user_id = ?",
        (user_id,),
    ).fetchone()
    conn.close()

    if row:
        try:
            return _decrypt_key(row["encrypted_key"])
        except Exception:
            return None
    return None


# ── Request / Response models ───────────────────────────────────

class SetKeyRequest(BaseModel):
    api_key: str


class KeyStatusResponse(BaseModel):
    has_custom_key: bool
    key_prefix: str | None = None  # First few chars only, never expose full key


# ── Endpoints ───────────────────────────────────────────────────

@router.post("/key", status_code=200)
def save_api_key(req: SetKeyRequest, user_id: str = Depends(get_current_user)):
    """Save the user's own API key (BYOK). Stored encrypted."""
    if not req.api_key or not req.api_key.strip():
        raise HTTPException(status_code=400, detail="API key is required")

    import sys, os as _os
    sys.path.insert(0, _os.path.join(_os.path.dirname(__file__), ".."))
    from db.database import get_db

    encrypted = _encrypt_key(req.api_key.strip())
    now = time.time()

    conn = get_db()
    conn.execute(
        """INSERT INTO user_api_keys (user_id, encrypted_key, created_at)
           VALUES (?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET encrypted_key = ?, created_at = ?""",
        (user_id, encrypted, now, encrypted, now),
    )
    conn.commit()
    conn.close()

    return {
        "status": "saved",
        "key_prefix": req.api_key[:8] + "..." if len(req.api_key) > 8 else "***",
    }


@router.get("/key", response_model=KeyStatusResponse)
def check_api_key(user_id: str = Depends(get_current_user)):
    """Check if the user has a custom API key set."""
    key = get_user_api_key(user_id)
    if key:
        prefix = key[:8] + "..." if len(key) > 8 else "***"
        return KeyStatusResponse(has_custom_key=True, key_prefix=prefix)
    return KeyStatusResponse(has_custom_key=False)


def resolve_api_key(user_id: str | None) -> str | None:
    """
    Resolve the effective API key for a user.
    Prefers user's custom key (BYOK), falls back to server key (free tier).
    Returns None if no key is available at all.
    """
    if user_id:
        custom_key = get_user_api_key(user_id)
        if custom_key:
            return custom_key

    # Fall back to server-side key
    return os.environ.get("DEEPSEEK_API_KEY")

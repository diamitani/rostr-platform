"""Authentication middleware — Bearer token validation."""

import secrets
import time
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# ── In-memory stores ────────────────────────────────────────────
# user_id -> {id, username, api_key, created_at}
_users: dict[str, dict] = {}
# session_token -> {user_id, username, created_at}
_sessions: dict[str, dict] = {}

security_scheme = HTTPBearer(auto_error=False)


def _get_user_by_api_key(api_key: str) -> dict | None:
    """Find a user by their API key."""
    for user in _users.values():
        if user["api_key"] == api_key:
            return user
    return None


def get_user_store():
    """Return the in-memory user store (for seeding/testing)."""
    return _users


def get_session_store():
    """Return the in-memory session store."""
    return _sessions


# ── Current user dependency ─────────────────────────────────────

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Security(security_scheme),
) -> str:
    """
    FastAPI dependency that extracts and validates the Bearer token.
    Returns the user_id if valid, raises 401 otherwise.
    Routes that DON'T require auth can use this with auto_error=False checked for None.
    """
    if credentials is None:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    token = credentials.credentials
    session = _sessions.get(token)
    if session is None:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")

    # Check if session expired (24 hour TTL)
    if time.time() - session["created_at"] > 86400:
        del _sessions[token]
        raise HTTPException(status_code=401, detail="Session expired")

    return session["user_id"]


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Security(security_scheme),
) -> str | None:
    """
    Like get_current_user but returns None instead of raising 401.
    For routes that work with or without auth.
    """
    if credentials is None:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

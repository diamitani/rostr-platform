"""Jev harness API — proxy to the Vercel-hosted ROSTR /v1 gateway.

Set ROSTR_HARNESS_URL to the Vercel origin (no trailing slash).
If unset, /v1/health still returns the contract.
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, Response

router = APIRouter()

HARNESS = os.environ.get("ROSTR_HARNESS_URL", "").rstrip("/")

CONTRACT = {
    "ok": True,
    "name": "ROSTR Jev harness",
    "version": "0.4.0",
    "proxy": HARNESS or None,
    "endpoints": [
        "GET /v1/health",
        "POST /v1/sessions",
        "POST /v1/sessions/{id}/turns",
        "GET /v1/sessions/{id}",
        "POST /v1/generate",
    ],
}


@router.get("/health")
@router.get("/")
def health() -> dict[str, Any]:
    return CONTRACT


def _forward(method: str, path: str, body: bytes, content_type: str) -> Response:
    if not HARNESS:
        return JSONResponse(
            status_code=503,
            content={
                "ok": False,
                "error": "Set ROSTR_HARNESS_URL to the Vercel harness origin",
                **CONTRACT,
            },
        )
    url = f"{HARNESS}/v1/{path.lstrip('/')}"
    req = urllib.request.Request(
        url,
        data=body if method != "GET" else None,
        method=method,
        headers={"Content-Type": content_type, "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            payload = res.read()
            return Response(content=payload, status_code=res.status, media_type="application/json")
    except urllib.error.HTTPError as e:
        return Response(content=e.read(), status_code=e.code, media_type="application/json")


@router.api_route("/sessions", methods=["GET", "POST", "OPTIONS"])
async def sessions_root(request: Request) -> Response:
    if request.method == "OPTIONS":
        return Response(status_code=204)
    body = await request.body()
    return _forward(request.method, "sessions", body, request.headers.get("content-type", "application/json"))


@router.api_route("/sessions/{sid}", methods=["GET", "POST", "OPTIONS"])
async def session_id(request: Request, sid: str) -> Response:
    if request.method == "OPTIONS":
        return Response(status_code=204)
    body = await request.body()
    return _forward(request.method, f"sessions/{sid}", body, request.headers.get("content-type", "application/json"))


@router.api_route("/sessions/{sid}/turns", methods=["POST", "OPTIONS"])
async def session_turns(request: Request, sid: str) -> Response:
    if request.method == "OPTIONS":
        return Response(status_code=204)
    body = await request.body()
    return _forward("POST", f"sessions/{sid}/turns", body, request.headers.get("content-type", "application/json"))


@router.api_route("/generate", methods=["POST", "OPTIONS"])
async def generate(request: Request) -> Response:
    if request.method == "OPTIONS":
        return Response(status_code=204)
    body = await request.body()
    return _forward("POST", "generate", body, request.headers.get("content-type", "application/json"))

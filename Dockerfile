FROM python:3.12-slim

WORKDIR /app

# Copy rostr-core first
COPY rostr-core/ ./rostr-core/
# Copy backend
COPY backend/ ./backend/

WORKDIR /app/backend

RUN pip install --no-cache-dir fastapi uvicorn pydantic

ENV PYTHONPATH=/app/rostr-core/src

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

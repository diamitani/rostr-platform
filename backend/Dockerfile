# ROSTR Backend — Docker image for AWS EC2/ECS deployment
# Build from the rostr-billion root:
#   docker build -f backend/Dockerfile -t rostr-backend .
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy rostr-core source
COPY rostr-core/src ./rostr-core/src

# Install rostr-core as editable
RUN pip install -e ./rostr-core 2>/dev/null || true

# Copy backend code
COPY backend/ .

# Create db directory and ensure it's writable
RUN mkdir -p db && chmod 777 db

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/')" || exit 1

# Start the server
CMD ["python", "main.py"]

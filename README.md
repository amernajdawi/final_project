# Expansion RAG

A RAG (Retrieval-Augmented Generation) application with expansion capabilities.

## Project Structure

- `expansion_rag/` - Backend service
- `expansion_rag_frontend/` - Frontend application built with Next.js, React, and TypeScript

## Requirements

- Docker and Docker Compose

## Docker Deployment

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Configure environment:
```bash
cp expansion_rag/.env.example expansion_rag/.env
# Edit .env file with your configuration
```

3. Build and start the services:
```bash
docker-compose up -d
```

4. Access the services:
   - Backend API: http://localhost:8000
   - Frontend application: http://localhost:3000

5. Stop the services:
```bash
docker-compose down
```

## Services

The application consists of two containerized services:

1. **Backend (app)**
   - Built from `expansion_rag/Dockerfile`
   - Runs on port 8000
   - Handles the RAG processing logic

2. **Frontend (frontend)**
   - Built from `expansion_rag_frontend/dockerfile`
   - Runs on port 3000
   - TypeScript/Next.js/React user interface

## Local Development (Alternative)

If you prefer running without Docker:

### Backend
```bash
cd expansion_rag
# Follow backend-specific instructions
```

### Frontend
```bash
cd expansion_rag_frontend
npm install
npm run dev
```
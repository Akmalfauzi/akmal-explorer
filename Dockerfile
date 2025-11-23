# Akmal Explorer - Backend
FROM oven/bun:1.3.1-alpine

WORKDIR /app

# Install system dependencies if needed
RUN apk add --no-cache libc6-compat

# Copy all package files first
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies for workspace
RUN bun install

# Copy source code after dependencies are installed
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Set backend as working directory
WORKDIR /app/apps/backend

# Generate migrations before starting
RUN bun run db:generate

# Expose port
EXPOSE 3000

# Wait for database and then run migrations and start server
CMD ["sh", "-c", "sleep 5 && bun run db:migrate && bun run db:seed && bun run src/index.ts"]

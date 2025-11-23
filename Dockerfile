# Akmal Explorer - Backend
FROM oven/bun:1.3.1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Build shared package
WORKDIR /app/packages/shared
RUN bun run build

# Set backend as working directory
WORKDIR /app/apps/backend

# Expose port
EXPOSE 3000

# Run migrations and start server
CMD ["sh", "-c", "bun run db:migrate && bun run src/index.ts"]

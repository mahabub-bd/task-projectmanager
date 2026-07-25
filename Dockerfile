# ----------------- Stage 1: Build -----------------
FROM node:24-alpine AS builder

# Build arguments (passed during docker build or runtime)
ARG VITE_API_BASE_URL
ARG VITE_ENCRYPTION_KEY

# Set environment variables for build time
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ENCRYPTION_KEY=$VITE_ENCRYPTION_KEY

# Set working directory
WORKDIR /app

# Copy workspace config and lock file from root
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy web app package.json
COPY apps/web/package.json ./apps/web/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web/ ./apps/web/

# Build the app
RUN pnpm run build --filter=web

# ----------------- Stage 2: Production -----------------
FROM nginx:alpine

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy dist folder from builder stage
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

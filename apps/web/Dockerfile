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

# Copy package files (these are in apps/web/)
COPY package.json ./

# Install dependencies using npm
RUN npm install --legacy-peer-deps

# Copy source code (already in apps/web/ context)
COPY . .

# Build the app
RUN npm run build

# ----------------- Stage 2: Production -----------------
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy dist folder from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

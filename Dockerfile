# Build stage
FROM node:18-alpine AS builder

# Accept build argument
ARG SKIP_API=false

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend project files
COPY frontend ./frontend

# Build the site with environment variable
WORKDIR /app/frontend
ENV SKIP_API=${SKIP_API}
ENV REVIEW_API_URL=http://backend:8080/api/reviews
RUN npx @11ty/eleventy

# Production stage
FROM nginx:alpine

# Copy built site from builder stage
COPY --from=builder /app/frontend/_site /usr/share/nginx/html

# Copy custom error pages
COPY frontend/502.html /usr/share/nginx/html/502.html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

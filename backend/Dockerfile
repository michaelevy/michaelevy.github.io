# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod file
COPY go.mod ./

# Copy source code (needed for go mod tidy to resolve imports)
COPY . .

# Tidy dependencies and download
RUN go mod tidy && go mod download

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/api

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy templates directory
COPY --from=builder /app/templates ./templates

# Create uploads directory and set ownership
RUN mkdir -p /app/uploads/resources && \
    chown -R appuser:appgroup /app

# Create entrypoint script that fixes volume permissions then drops to appuser
RUN printf '#!/bin/sh\nchown appuser:appgroup /app/uploads/resources\nexec su-exec appuser "$@"\n' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

RUN apk --no-cache add su-exec

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["./main"]

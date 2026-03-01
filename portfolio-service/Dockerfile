FROM golang:1.24-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git

COPY shared/go.mod shared/go.sum ./shared/
COPY portfolio-service/go.mod portfolio-service/go.sum ./portfolio-service/

WORKDIR /app/portfolio-service
RUN go mod download

COPY shared ../shared
COPY portfolio-service .
RUN go build -o main ./cmd

FROM alpine:3.20 AS runtime
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/portfolio-service/main .
COPY --from=builder /app/shared/config ./config 

EXPOSE 8003
CMD ["./main"]
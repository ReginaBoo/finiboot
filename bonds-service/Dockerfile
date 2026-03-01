FROM golang:1.24-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git

COPY shared/go.mod shared/go.sum ./shared/
COPY bonds-service/go.mod bonds-service/go.sum ./bonds-service/

WORKDIR /app/bonds-service
RUN go mod download

COPY shared ../shared
COPY bonds-service .
RUN go build -o main ./cmd

FROM alpine:3.20 AS runtime

WORKDIR /app
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/bonds-service/main .
COPY --from=builder /app/shared/config ./config 

EXPOSE 8002
CMD ["./main"]
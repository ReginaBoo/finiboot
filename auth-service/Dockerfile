FROM golang:1.24-alpine

WORKDIR /app

RUN apk add --no-cache git
COPY shared/go.mod shared/go.sum ./shared/
COPY shared/config ./shared/config
COPY shared/db ./shared/db
COPY auth-service ./auth-service

WORKDIR /app/auth-service

RUN go mod download
RUN go build -o main ./cmd

CMD ["./main"]
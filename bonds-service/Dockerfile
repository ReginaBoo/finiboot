FROM golang:1.24-alpine

WORKDIR /app
RUN apk add --no-cache git
COPY shared ./shared
COPY bonds-service ./bonds-service

WORKDIR /app/bonds-service

RUN go mod download
RUN go build -o main ./cmd

CMD ["./main"]
package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type PriceCache struct {
	client *redis.Client
}

func NewPriceCache(host string, port string) *PriceCache {
	rdb := redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", host, port),
	})
	return &PriceCache{client: rdb}
}

func (c *PriceCache) SetPrice(ctx context.Context, isin string, price float64) error {
	return c.client.Set(ctx, "price:"+isin, price, 2*time.Hour).Err()
}

func (c *PriceCache) GetPrice(ctx context.Context, isin string) (float64, error) {
	return c.client.Get(ctx, "price:"+isin).Float64()
}

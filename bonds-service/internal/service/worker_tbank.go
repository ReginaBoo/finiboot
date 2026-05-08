package service

import (
	"context"
	"log"
	"time"
)

type Worker struct {
	service  *SyncService
	interval time.Duration
}

func NewSyncWorker(service *SyncService) *Worker {
	return &Worker{
		service: service,
	}
}
func (w *Worker) Start(ctx context.Context) {
	priceTicker := time.NewTicker(5 * time.Minute)
	fullSyncTicker := time.NewTicker(1 * time.Hour)
	go func() {

		for {
			select {

			case <-ctx.Done():
				return

			case <-priceTicker.C:
				if err := w.service.UpdateMarketPrices(ctx); err != nil {
					log.Println("Price update error:", err)
				}

			case <-fullSyncTicker.C:
				if err := w.service.SyncBondsFromTbank(); err != nil {
					log.Println("sync error:", err)
				}
			}
		}

	}()
}

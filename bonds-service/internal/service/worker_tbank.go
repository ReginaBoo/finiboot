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

func NewSyncWorker(service *SyncService, interval time.Duration) *Worker {
	return &Worker{
		service:  service,
		interval: interval,
	}
}
func (w *Worker) Start(ctx context.Context) {

	ticker := time.NewTicker(w.interval)

	go func() {

		for {
			select {

			case <-ctx.Done():
				return

			case <-ticker.C:

				log.Println("sync started")

				err := w.service.SyncBondsFromTbank()

				if err != nil {
					log.Println("sync error:", err)
				}

				log.Println("sync finished")
			}
		}

	}()
}

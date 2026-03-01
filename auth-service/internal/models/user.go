package models

type User struct {
	ID           uint   `json:"id" gorm:"primaryKey"`
	Name         string `json:"name"`
	Email        string `json:"email" gorm:"uniqueIndex;not null"`
	Password     string `json:"password"`
	RefreshToken string `json:"-"`
}

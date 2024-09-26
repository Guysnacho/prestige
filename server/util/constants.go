package util

type User struct {
	Name string `json:"name" binding:"required"`
}

type Location struct {
	Lng string `json:"lng" binding:"required"`
	Lat string `json:"lat" binding:"required"`
}

type Trip struct {
	Id          int     `json:"id" binding required`
	Driver      *string `json:"driver"`
	Rider       string  `json:"rider" binding required`
	Status      string  `json:"status" binding required`
	Pickup_time string  `json:"pickup_time" binding required`
	Pickup_lng  float64 `json:"pickup_lng" binding required`
	Pickup_lat  float64 `json:"pickup_lat" binding required`
	Dest_lng    float64 `json:"dest_lng" binding required`
	Dest_lat    float64 `json:"dest_lat" binding required`
	Created_at  string  `json:"created_at" binding required`
	Updated_at  string  `json:"updated_at" binding required`
}

const UserNotFound = "user not found"

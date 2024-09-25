package util

type User struct {
	Name string `json:"name" binding:"required"`
}

type Location struct {
	Lng string `json:"lng" binding:"required"`
	Lat string `json:"lat" binding:"required"`
}

const UserNotFound = "user not found"

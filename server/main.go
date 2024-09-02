package main

import (
	"prestige/handlers"
	util "prestige/util"

	"github.com/gin-gonic/gin"
)

type routes struct {
	router *gin.Engine
}

func main() {
	logger := util.DefaultLogger()

	logger.Info("Starting server")
	r := initRoutes()
	err := r.Run()

	if err != nil {
		panic(err)
	}
}

func initRoutes() routes {
	r := routes{
		router: gin.Default(),
	}

	driver := r.router.Group("/driver")
	rider := r.router.Group("/rider")

	r.addDriverRoutes(driver)
	r.addRiderRoutes(rider)

	return r
}

func (r routes) Run(addr ...string) error {
	return r.router.Run()
}

func (r routes) addDriverRoutes(rg *gin.RouterGroup) {
	rg.POST("/trip", handlers.DriverRequestTrip)
}

func (r routes) addRiderRoutes(rg *gin.RouterGroup) {
	rg.POST("/trip", handlers.RiderRequestTrip)
}

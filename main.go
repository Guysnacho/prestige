package main

import (
	"prestige/handlers"
	"prestige/util"
	workflows "prestige/workflows"

	"github.com/gin-gonic/gin"
)

type routes struct {
	router *gin.Engine
}

var HostPort = "127.0.0.1:7833"

// var HostPort = "localhost:8800"
var Domain = "prestige-api"

func main() {
	logger := util.DefaultLogger()

	util.DefaultWorker(Domain + "-worker")

	logger.Info("Starting server")
	r := initRoutes()
	err := r.Run(":8800")

	if err != nil {
		panic(err)
	}
}

func initRoutes() routes {
	r := routes{
		router: gin.Default(),
	}

	workflows.InitRideRequest()
	workflows.InitDriverJoin()
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

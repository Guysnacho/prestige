package main

import (
	"prestige/handlers"
	"prestige/util"
	workflows "prestige/workflows"

	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"
	"go.uber.org/cadence/compatibility"
	"go.uber.org/cadence/worker"
	"go.uber.org/zap/zapcore"

	"github.com/gin-gonic/gin"
	"github.com/uber-go/tally"
	apiv1 "github.com/uber/cadence-idl/go/proto/api/v1"
	"go.uber.org/yarpc"
	"go.uber.org/yarpc/transport/grpc"
	"go.uber.org/zap"
)

type routes struct {
	router *gin.Engine
}

var HostPort = "127.0.0.1:7833"

// var HostPort = "localhost:8800"
var Domain = "prestige-api"
var TaskListName = "prestige-queue"
var ClientName = "client"
var CadenceService = "cadence-frontend"

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

func buildLogger() *zap.Logger {
	config := zap.NewDevelopmentConfig()
	config.Level.SetLevel(zapcore.InfoLevel)

	var err error
	logger, err := config.Build()
	if err != nil {
		panic("Failed to setup logger")
	}

	return logger
}

func buildCadenceClient() workflowserviceclient.Interface {
	dispatcher := yarpc.NewDispatcher(yarpc.Config{
		Name: ClientName,
		Outbounds: yarpc.Outbounds{
			CadenceService: {Unary: grpc.NewTransport().NewSingleOutbound(HostPort)},
		},
	})
	if err := dispatcher.Start(); err != nil {
		panic("Failed to start dispatcher")
	}

	clientConfig := dispatcher.ClientConfig(CadenceService)

	return compatibility.NewThrift2ProtoAdapter(
		apiv1.NewDomainAPIYARPCClient(clientConfig),
		apiv1.NewWorkflowAPIYARPCClient(clientConfig),
		apiv1.NewWorkerAPIYARPCClient(clientConfig),
		apiv1.NewVisibilityAPIYARPCClient(clientConfig),
	)
}

func startWorker(logger *zap.Logger, service workflowserviceclient.Interface) {
	// TaskListName identifies set of client workflows, activities, and workers.
	// It could be your group or client or application name.
	workerOptions := worker.Options{
		Logger:       logger,
		MetricsScope: tally.NewTestScope(TaskListName, map[string]string{}),
	}

	worker := worker.New(
		service,
		Domain,
		TaskListName,
		workerOptions)
	err := worker.Start()
	if err != nil {
		panic("Failed to start worker")
	}

	logger.Info("Started Worker.", zap.String("worker", TaskListName))
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

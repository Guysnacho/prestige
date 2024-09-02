package workflows

import (
	"context"
	"log"
	"time"

	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

func InitRideRequest() {
	log.Println("Initializing rideRequestWorkflow")
	workflow.Register(rideRequestWorkflow)
	activity.Register(rideRequestActivity)
}

func rideRequestWorkflow(ctx workflow.Context, name string) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute,
		HeartbeatTimeout:       time.Second * 20,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("helloworld workflow started")
	var rideRequestResult string
	err := workflow.ExecuteActivity(ctx, rideRequestActivity, name).Get(ctx, &rideRequestResult)
	if err != nil {
		logger.Error("Activity failed.", zap.Error(err))
		return err
	}

	logger.Info("Workflow completed.", zap.String("Result", rideRequestResult))

	return nil
}

func rideRequestActivity(ctx context.Context, name string) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("initiating ride - " + name)

	time.Sleep(5000)
	return "Hello " + name + "!", nil
}

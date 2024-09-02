package workflows

import (
	"context"
	"log"
	"time"

	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

func init() {
	log.Println("Initializing helloWorldWorkflow")
	workflow.Register(helloWorldWorkflow)
	activity.Register(helloWorldActivity)
}

func helloWorldWorkflow(ctx workflow.Context, name string) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute,
		HeartbeatTimeout:       time.Second * 20,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("helloworld workflow started")
	var helloworldResult string
	err := workflow.ExecuteActivity(ctx, helloWorldActivity, name).Get(ctx, &helloworldResult)
	if err != nil {
		logger.Error("Activity failed.", zap.Error(err))
		return err
	}

	logger.Info("Workflow completed.", zap.String("Result", helloworldResult))

	return nil
}

func helloWorldActivity(ctx context.Context, name string) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("helloworld activity started")
	time.Sleep(5000)
	return "Hello " + name + "!", nil
}

package workflows

import (
	"context"
	"log"
	"time"

	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

func InitDriverJoin() {
	log.Println("Initializing JoinPoolWorkflow")
	workflow.Register(JoinPoolWorkflow)
	activity.Register(joinPoolActivity)
}

func JoinPoolWorkflow(ctx workflow.Context, name string) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute,
		HeartbeatTimeout:       time.Second * 20,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("helloworld workflow started")
	var joinPoolResult string
	err := workflow.ExecuteActivity(ctx, joinPoolActivity, name).Get(ctx, &joinPoolResult)
	if err != nil {
		logger.Error("Activity failed.", zap.Error(err))
		return err
	}

	logger.Info("Workflow completed.", zap.String("Result", joinPoolResult))

	return nil
}

func joinPoolActivity(ctx context.Context, name string) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("initiating ride - " + name)

	time.Sleep(5000)
	return "Hello " + name + "!", nil
}

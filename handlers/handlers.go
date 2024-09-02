package handlers

import (
	"context"
	"net/http"
	"time"

	util "prestige/util"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/pborman/uuid"
	"go.uber.org/cadence/.gen/go/shared"

	"go.uber.org/yarpc"
)

var Domain = "prestige-api"

type message struct {
	Name string `json:"name" binding:"required"`
}

func Ping(c *gin.Context) {
	var message message
	if err := c.ShouldBindBodyWith(&message, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, message)
}

func DriverRequestTrip(c *gin.Context) {
	tasklist := "prestige"
	workflowID := uuid.New()
	requestID := uuid.New()
	executionTimeout := int32(60)

	workflowType := "prestige/workflows.JoinPoolWorkflow"
	input := []byte(`{"name": "` + "Tunji" + `"}`)

	logger, cClient := util.DefaultLogger(), util.BuildCadenceClient("driver-"+c.HandlerName())
	enrichedContext, cancel := context.WithTimeout(c, time.Minute*time.Duration(float64(1)))
	ttl := int32(60)

	req := shared.StartWorkflowExecutionRequest{
		Domain:     &util.Domain,
		WorkflowId: &workflowID,
		WorkflowType: &shared.WorkflowType{
			Name: &workflowType,
		},
		TaskList: &shared.TaskList{
			Name: &tasklist,
		},
		Input:                               input,
		ExecutionStartToCloseTimeoutSeconds: &executionTimeout,
		TaskStartToCloseTimeoutSeconds:      &ttl,
		RequestId:                           &requestID,
	}

	defer cancel()
	res, err := cClient.StartWorkflowExecution(
		enrichedContext,
		&req,
		yarpc.WithRoutingKey(workflowType),
	)

	if err != nil {
		logger.Error(err.Error())
		c.JSON(500, gin.H{
			"message":   "error starting workflow",
			"requestId": requestID,
		})
	} else {
		c.JSON(200, gin.H{
			"message":   "Joined driver pool",
			"requestId": requestID,
			"runId":     res.RunId,
		})
	}
}

func RiderRequestTrip(c *gin.Context) {
	domain := "prestige-api"
	tasklist := "prestige"
	workflowID := uuid.New()
	requestID := uuid.New()
	executionTimeout := int32(60)
	closeTimeout := int32(60)

	workflowType := "workflows.JoinPoolWorkflow"
	input := []byte(`{"name": "` + "Tunji" + `"}`)

	logger, cClient := util.DefaultLogger(), util.BuildCadenceClient("driver-"+c.HandlerName())
	req := shared.StartWorkflowExecutionRequest{
		Domain:     &domain,
		WorkflowId: &workflowID,
		WorkflowType: &shared.WorkflowType{
			Name: &workflowType,
		},
		TaskList: &shared.TaskList{
			Name: &tasklist,
		},
		Input:                               input,
		ExecutionStartToCloseTimeoutSeconds: &executionTimeout,
		TaskStartToCloseTimeoutSeconds:      &closeTimeout,
		RequestId:                           &requestID,
	}

	res, err := cClient.StartWorkflowExecution(
		c,
		&req,
		yarpc.CallOption{},
	)

	if err != nil {
		logger.Error(err.Error())
		c.JSON(500, gin.H{
			"message":   "error starting workflow",
			"requestId": requestID,
		})
	} else {
		c.JSON(200, gin.H{
			"message":   "ride requested",
			"requestId": requestID,
			"runId":     res.RunId,
		})
	}
}

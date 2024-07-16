import * as cdk from "aws-cdk-lib";
import {
	aws_apigatewayv2 as apigwv2,
	aws_apigatewayv2_integrations as apigwv2_integ,
	aws_lambda as awslambda,
	type aws_dynamodb as dynamodb,
	aws_lambda_event_sources as lambda_es,
	aws_lambda_nodejs as lambdanodejs,
	aws_logs as logs,
} from "aws-cdk-lib";
import { Construct } from "constructs";

type AppStackProWebSocketApiConstructProps = {
	wsApiDataTable: dynamodb.Table;
	sessionTable: dynamodb.Table;
	questionnairesTable: dynamodb.Table;
};

const resourceNamePrefix = "odyssey-osaka";
export const serviceName = "odyssey-osaka-wsapi";

export class WebSocketApiConstruct extends Construct {
	constructor(
		scope: Construct,
		id: string,
		props: AppStackProWebSocketApiConstructProps,
	) {
		super(scope, id);

		const wsApiHandler = new lambdanodejs.NodejsFunction(this, "WsApiHandler", {
			functionName: `${resourceNamePrefix}-wsapi-handler`,
			entry: "resources/ws-handler.ts",
			handler: "handler",
			runtime: awslambda.Runtime.NODEJS_20_X,
			memorySize: 1769,
			timeout: cdk.Duration.seconds(30),
			environment: {
				SERVICE_NAME: serviceName,
				CONNECTION_TABLE_NAME: props.wsApiDataTable.tableName,
				POWERTOOLS_SERVICE_NAME: serviceName,
				POWERTOOLS_LOG_LEVEL: "DEBUG",
			},
			bundling: {
				forceDockerBundling: false,
				// sourceMap: true,
			},
			tracing: awslambda.Tracing.ACTIVE,
		});
		new logs.LogGroup(this, "WsApiHandlerLogGroup", {
			logGroupName: `/aws/lambda/${wsApiHandler.functionName}`,
			retention: logs.RetentionDays.THREE_DAYS,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
		props.wsApiDataTable.grantReadWriteData(wsApiHandler);

		const webSocketApi = new apigwv2.WebSocketApi(this, "WebSocketApi", {
			apiName: `${resourceNamePrefix}-websocket-api`,
			connectRouteOptions: {
				integration: new apigwv2_integ.WebSocketLambdaIntegration(
					"ConnectIntegration",
					wsApiHandler,
				),
			},
			disconnectRouteOptions: {
				integration: new apigwv2_integ.WebSocketLambdaIntegration(
					"DisconnectIntegration",
					wsApiHandler,
				),
			},
		});
		webSocketApi.addRoute("hello", {
			integration: new apigwv2_integ.WebSocketLambdaIntegration(
				"HelloIntegration",
				wsApiHandler,
			),
		});

		const stage = new apigwv2.WebSocketStage(this, "WebSocketApiDev", {
			webSocketApi,
			stageName: "dev",
			autoDeploy: true,
		});

		const sendMessageHandler = new lambdanodejs.NodejsFunction(
			this,
			"sendMessageHandler",
			{
				functionName: `${resourceNamePrefix}-send-message`,
				entry: "resources/send-message-handler.ts",
				handler: "handler",
				runtime: awslambda.Runtime.NODEJS_20_X,
				memorySize: 1769,
				timeout: cdk.Duration.minutes(15),
				environment: {
					SERVICE_NAME: serviceName,
					CONNECTION_TABLE_NAME: props.wsApiDataTable.tableName,
					CALLBACK_URL: stage.callbackUrl,
					POWERTOOLS_SERVICE_NAME: serviceName,
					POWERTOOLS_LOG_LEVEL: "DEBUG",
				},
				bundling: {
					forceDockerBundling: false,
					// sourceMap: true,
				},
				tracing: awslambda.Tracing.ACTIVE,
			},
		);
		new logs.LogGroup(this, "SendMessageHandlerLogGroup", {
			logGroupName: `/aws/lambda/${sendMessageHandler.functionName}`,
			retention: logs.RetentionDays.THREE_DAYS,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
		props.wsApiDataTable.grantReadData(sendMessageHandler);
		props.sessionTable.grantReadData(sendMessageHandler);
		props.questionnairesTable.grantReadData(sendMessageHandler);

		sendMessageHandler.addEventSource(
			new lambda_es.DynamoEventSource(props.sessionTable, {
				startingPosition: awslambda.StartingPosition.LATEST,
				filters: [
					awslambda.FilterCriteria.filter({
						eventName: awslambda.FilterRule.isEqual("INSERT"),
					}),
					awslambda.FilterCriteria.filter({
						eventName: awslambda.FilterRule.isEqual("MODIFY"),
					}),
				],
			}),
		);
		sendMessageHandler.addEventSource(
			new lambda_es.DynamoEventSource(props.questionnairesTable, {
				startingPosition: awslambda.StartingPosition.LATEST,
				filters: [
					awslambda.FilterCriteria.filter({
						eventName: awslambda.FilterRule.isEqual("INSERT"),
					}),
					awslambda.FilterCriteria.filter({
						eventName: awslambda.FilterRule.isEqual("MODIFY"),
					}),
				],
			}),
		);
		webSocketApi.grantManageConnections(sendMessageHandler);
	}
}

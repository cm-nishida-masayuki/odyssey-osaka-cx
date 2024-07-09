import {
	aws_apigateway as apigateway,
	aws_iam as iam,
	Stack,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { readFileSync } from "fs";
import { resolve } from "path";

type ApiConstructProps = {
	questionnairesTabName: string;
	questionnaireIdGsiName: string;
};

export class ApiConstruct extends Construct {
	constructor(scope: Construct, id: string, props: ApiConstructProps) {
		super(scope, id);

		const restApi = new apigateway.RestApi(this, "Default", {
			restApiName: "odyssey-osaka-api",
			description:
				"This service provides the API for Odyssey Osaka ex CX booth",
			defaultCorsPreflightOptions: {
				allowOrigins: apigateway.Cors.ALL_ORIGINS,
				allowMethods: apigateway.Cors.ALL_METHODS,
				allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
			},
		});

		const region = Stack.of(this).region;
		const accountId = Stack.of(this).account;
		const vtlDir = resolve(__dirname, "../vtl-templates");

		const itgIamRole = new iam.Role(this, "ItgIamRole", {
			assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
			inlinePolicies: {
				dynamoDBPolicy: new iam.PolicyDocument({
					statements: [
						new iam.PolicyStatement({
							actions: ["dynamodb:Scan"],
							resources: [
								`arn:aws:dynamodb:${region}:${accountId}:table/${props.questionnairesTabName}`,
							],
						}),
					],
				}),
			},
		});

		const sharedMethodOptions = {
			responseModels: {
				"application/json": apigateway.Model.EMPTY_MODEL,
			},
			responseParameters: {
				"method.response.header.Access-Control-Allow-Origin": true,
			},
		};

		const methodOptions = {
			methodResponses: [
				{
					statusCode: "200",
					...sharedMethodOptions,
				},
				{
					statusCode: "400",
					...sharedMethodOptions,
				},
				{
					statusCode: "500",
					...sharedMethodOptions,
				},
			],
		};

		const responseCorsHeaders = {
			"method.response.header.Access-Control-Allow-Origin": "'*'",
		};

		const queryQuestionnairesItg = new apigateway.AwsIntegration({
			service: "dynamodb",
			integrationHttpMethod: "POST",
			action: "Scan",
			options: {
				credentialsRole: itgIamRole,
				requestTemplates: {
					"application/json": JSON.stringify({
						TableName: props.questionnairesTabName,
						IndexName: props.questionnaireIdGsiName,
					}),
				},
				passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
				integrationResponses: [
					{
						statusCode: "200",
						responseParameters: {
							...responseCorsHeaders,
						},
						responseTemplates: {
							"application/json": readFileSync(
								resolve(vtlDir, "list-questionnaires-response.vtl"),
							).toString(),
						},
					},
				],
			},
		});
		const listQuestionnaires = restApi.root
			.addResource("questionnaires")
			.addMethod("GET", queryQuestionnairesItg, methodOptions);
	}
}

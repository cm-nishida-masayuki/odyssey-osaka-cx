import * as cdk from "aws-cdk-lib";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as wsapi from "./ws-api";

type DatabaseConstructProps = {};

export class DatabaseConstruct extends Construct {
	readonly questionnaireIdGsiName: string;
	readonly wsApiDataTable: dynamodb.Table;
	readonly questionnairesTable: dynamodb.Table;
	readonly sessionTable: dynamodb.Table;

	constructor(scope: Construct, id: string, props?: DatabaseConstructProps) {
		super(scope, id);

		const questionnaires = new dynamodb.Table(this, "Questionnaires", {
			partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
			sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
			tableName: "odyssey-osaka-questionnaires",
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			stream: dynamodb.StreamViewType.NEW_IMAGE,
		});
		this.questionnaireIdGsiName = "gsi-questionnaireId";
		questionnaires.addGlobalSecondaryIndex({
			indexName: this.questionnaireIdGsiName,
			partitionKey: {
				name: "questionnaireId",
				type: dynamodb.AttributeType.NUMBER,
			},
		});
		this.questionnairesTable = questionnaires;

		const sessions = new dynamodb.Table(this, "Sessions", {
			partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
			sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
			tableName: "odyssey-osaka-sessions",
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			stream: dynamodb.StreamViewType.NEW_IMAGE,
		});
		sessions.addGlobalSecondaryIndex({
			indexName: "gsi-sessionId",
			partitionKey: {
				name: "sessionId",
				type: dynamodb.AttributeType.NUMBER,
			},
		});
		this.sessionTable = sessions;

		const wsApiData = new dynamodb.Table(this, "WebServiceApiDataTable", {
			tableName: wsapi.serviceName,
			partitionKey: {
				name: "pk",
				type: dynamodb.AttributeType.STRING,
			},
			sortKey: {
				name: "sk",
				type: dynamodb.AttributeType.STRING,
			},
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
		wsApiData.addGlobalSecondaryIndex({
			indexName: "gsi1",
			partitionKey: {
				name: "gsi1pk",
				type: dynamodb.AttributeType.STRING,
			},
			sortKey: {
				name: "gsi1sk",
				type: dynamodb.AttributeType.STRING,
			},
			projectionType: dynamodb.ProjectionType.ALL,
		});
		this.wsApiDataTable = wsApiData;
	}
}

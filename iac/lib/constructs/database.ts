import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { Construct } from "constructs";

type DatabaseConstructProps = {};

export class DatabaseConstruct extends Construct {
	readonly questionnairesTableName: string;
	readonly sessionTableName: string;
	readonly questionnaireIdGsiName: string;

	constructor(scope: Construct, id: string, props?: DatabaseConstructProps) {
		super(scope, id);

		const questionnaires = new dynamodb.Table(this, "Questionnaires", {
			partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
			sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
			tableName: "odyssey-osaka-questionnaires",
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
		});
		this.questionnaireIdGsiName = "gsi-questionnaireId";
		questionnaires.addGlobalSecondaryIndex({
			indexName: this.questionnaireIdGsiName,
			partitionKey: {
				name: "questionnaireId",
				type: dynamodb.AttributeType.NUMBER,
			},
		});
		this.questionnairesTableName = questionnaires.tableName;

		const sessions = new dynamodb.Table(this, "Sessions", {
			partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
			sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
			tableName: "odyssey-osaka-sessions",
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
		});
		sessions.addGlobalSecondaryIndex({
			indexName: "gsi-sessionId",
			partitionKey: { name: "sessionId", type: dynamodb.AttributeType.NUMBER },
		});
		this.sessionTableName = sessions.tableName;
	}
}

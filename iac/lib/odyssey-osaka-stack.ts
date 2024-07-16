import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import { ApiConstruct } from "./constructs/api";
import { DatabaseConstruct } from "./constructs/database";
import { WebSocketApiConstruct } from "./constructs/ws-api";

export class OdysseyOsakaStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);
		const database = new DatabaseConstruct(this, "Database", {});
		new ApiConstruct(this, "Api", {
			questionnairesTabName: database.questionnairesTable.tableName,
			questionnaireIdGsiName: database.questionnaireIdGsiName,
      sessionsTabName: database.sessionTable.tableName,
      sessionIdGsiName: database.sessionsIdGsiName,
		});
		new WebSocketApiConstruct(this, "WebSocketApi", {
			wsApiDataTable: database.wsApiDataTable,
			sessionTable: database.sessionTable,
			questionnairesTable: database.questionnairesTable,
		});
	}
}

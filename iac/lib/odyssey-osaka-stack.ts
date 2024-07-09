import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiConstruct } from "./constructs/api";
import { DatabaseConstruct } from "./constructs/database";

export class OdysseyOsakaStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);
		const database = new DatabaseConstruct(this, "Database", {});
		new ApiConstruct(this, "Api", {
			questionnairesTabName: database.questionnairesTableName,
			questionnaireIdGsiName: database.questionnaireIdGsiName,
		});
	}
}

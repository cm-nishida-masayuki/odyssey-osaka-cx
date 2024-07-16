import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { GenAiApiConstruct } from "./constructs/gen-ai-api";

export class GenAiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new GenAiApiConstruct(this, "GenAiApi");
  }
}

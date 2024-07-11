#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OdysseyOsakaStack } from "../lib/odyssey-osaka-stack";
import { GenAiStack } from "../lib/gen-ai-stack";

const app = new cdk.App();
new OdysseyOsakaStack(app, "OdysseyOsaka", {});

new GenAiStack(app, "GenAiStack", {
  env: {
    region: "us-east-1",
  },
});

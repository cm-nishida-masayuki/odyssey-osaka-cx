#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { GenAiStack } from "../lib/gen-ai-stack";
import { OdysseyOsakaStack } from "../lib/odyssey-osaka-stack";
import { OdysseyOsakaWebStack } from "../lib/odyssey-osaka-web-stack";

const app = new cdk.App();
new OdysseyOsakaStack(app, "OdysseyOsaka", {});

new GenAiStack(app, "GenAiStack", {
  env: {
    region: "us-east-1",
  },
});

new OdysseyOsakaWebStack(app, "OdysseyOsakaWebStack", {});

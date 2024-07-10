#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OdysseyOsakaStack } from "../lib/odyssey-osaka-stack";
import { GenaiApiStack as GenAiApiStack } from "../lib/constructs/genai-api";

const app = new cdk.App();
new OdysseyOsakaStack(app, "OdysseyOsaka", {});

new GenAiApiStack(app, "GenAiApi", {
  env: {
    region: "us-west-1",
  },
});

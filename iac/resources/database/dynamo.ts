import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import type { EntityConfiguration } from "electrodb";

// const credentials = fromEnv();
// export const Client = new DynamoDBClient({ credentials: credentials });
export const Client = new DynamoDBClient({});

export const Configuration: EntityConfiguration = {
	table: process.env.CONNECTION_TABLE_NAME,
	client: Client,
};

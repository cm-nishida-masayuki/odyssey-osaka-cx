import { Logger } from "@aws-lambda-powertools/logger";
import type {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
} from "aws-lambda";
// import "source-map-support/register";
import * as z from "zod";
import { ConnectionEntity } from "./database/entity";

const logger = new Logger();

const HelloMessage = z.object({
	action: z.literal("hello"),
	type: z.enum(["QUESTIONNAIRE", "SESSION"]),
	id: z.number(),
});

export async function handler(
	event: APIGatewayProxyWebsocketEventV2,
): Promise<APIGatewayProxyResultV2> {
	logger.debug("Event:", JSON.stringify(event));

	const connId = event.requestContext.connectionId;
	const routeKey = event.requestContext.routeKey;

	switch (routeKey) {
		case "$connect":
			await ConnectionEntity.create({
				connectionId: connId,
			}).go();
			logger.debug(`Connection established. connectionId: ${connId}`);
			return {
				statusCode: 200,
				body: "Connected",
			};
		case "$disconnect":
			await ConnectionEntity.delete({
				connectionId: connId,
			}).go();
			logger.debug(`Connection disconnected. connectionId: ${connId}`);
			return {
				statusCode: 200,
				body: "Disconnected",
			};
		case "hello": {
			const msg = HelloMessage.safeParse(JSON.parse(event.body || "{}"));
			if (!msg.success) {
				return {
					statusCode: 400,
					body: "Bad Request",
				};
			}
			logger.debug(
				`Hello! connectionId: ${connId}, type: ${msg.data.type}, id: ${msg.data.id}`,
			);
			const result = await ConnectionEntity.update({
				connectionId: connId,
			})
				.set({
					listenType: msg.data.type,
					listenId: msg.data.id,
				})
				.go();
			logger.debug(JSON.stringify(result));
			return {
				statusCode: 200,
				body: "Hello",
			};
		}
		default:
			return {
				statusCode: 400,
				body: "Bad Request",
			};
	}
}

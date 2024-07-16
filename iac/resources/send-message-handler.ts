import { Logger } from "@aws-lambda-powertools/logger";
import {
	ApiGatewayManagementApiClient,
	PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import type { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import * as z from "zod";
// import "source-map-support/register";
import { type ConnectionEntityType, getTargetConnections } from "./database";

const logger = new Logger();

const AnswerSchema = z.object({
	participantId: z.string(),
	participantName: z.string(),
	choise: z.string().nullish(),
	content: z.string().nullish(),
	answerAt: z.string(),
});

const CommentSchema = z.object({
	sessionId: z.number(),
	participantId: z.string(),
	participantName: z.string(),
	comment: z.string().nullish(),
	commentAt: z.string(),
});

const MessageSchema = z.object({
	answers: z.array(AnswerSchema).optional(),
	comments: z.array(CommentSchema).optional(),
});
type Message = z.infer<typeof MessageSchema>;

export async function handler(event: DynamoDBStreamEvent) {
	logger.debug("Event:", JSON.stringify(event));

	for (const record of event.Records) {
		logger.debug("Record:", JSON.stringify(record));

		const id = Number(record.dynamodb?.Keys?.id.N);
		const type = getListenType(record);

		const targets = await getTargetConnections(type, id);
		logger.debug("Targets:", JSON.stringify(targets));

		try {
			const message = getMessage(type, record);
			logger.debug("Message:", JSON.stringify(message));

			await sendMessage(type, id, message, targets);
		} catch (error) {
			// 失敗したらログだけ吐いて継続
			logger.error(JSON.stringify(error));
		}
	}
}

const getListenType = (record: DynamoDBRecord): string => {
	return record.dynamodb?.Keys?.sk.S?.split("#")[0] || "UNDEFINED";
};

async function sendMessage(
	listenType: string,
	listenId: number,
	message: Message,
	targets: ConnectionEntityType[],
) {
	logger.debug(
		`Sending message. listenType: ${listenType}, listenId: ${listenId}`,
	);
	// const targets = await getTargetConnections(listenType, listenId);
	logger.debug("Targets:", JSON.stringify(targets));

	const client = new ApiGatewayManagementApiClient({
		endpoint: process.env.CALLBACK_URL,
	});

	for (const target of targets) {
		logger.debug(
			`Sending message to connection. connectionId: ${target.connectionId}, endpoint: ${process.env.CALLBACK_URL}`,
		);
		const command = new PostToConnectionCommand({
			ConnectionId: target.connectionId,
			Data: JSON.stringify(message),
		});
		try {
			const response = await client.send(command);
			logger.debug("Response:", JSON.stringify(response));
		} catch (error) {
			// 失敗したらログだけ吐いて継続
			// TODO: クライアントの接続が切れている場合はエラーになるのでテーブルから対象を削除する
			logger.error(JSON.stringify(error));
		}
	}
}

function getMessage(listenType: string, record: DynamoDBRecord): Message {
	const message: Message = {};
	switch (listenType) {
		case "QUESTIONNAIRE":
			message.answers = [
				{
					participantId:
						record.dynamodb?.NewImage?.participantId?.S || "undefined",
					participantName:
						record.dynamodb?.NewImage?.participantName?.S || "undefined",
					choise: record.dynamodb?.NewImage?.answerChoice?.S || "undefined",
					answerAt: record.dynamodb?.NewImage?.answerAt?.S || "undefined",
				},
			];
			break;
		case "SESSION":
			message.comments = [
				{
					sessionId: Number(record.dynamodb?.NewImage?.id?.N) || 0,
					participantId:
						record.dynamodb?.NewImage?.participantId?.S || "undefined",
					participantName:
						record.dynamodb?.NewImage?.participantName?.S || "undefined",
					comment: record.dynamodb?.NewImage?.comment?.S || "undefined",
					commentAt: record.dynamodb?.NewImage?.commentAt?.S || "undefined",
				},
			];
			break;
		default:
			throw new Error("Invalid message type");
	}
	const parse = MessageSchema.safeParse(message);
	if (!parse.success) {
		logger.error("Invalid message", parse.error);
	}
	return message;
}

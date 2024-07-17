import { Entity, type EntityItem } from "electrodb";
import * as Dynamo from "./dynamo";

export const ConnectionEntity = new Entity(
	{
		model: {
			version: "1",
			entity: "Connection",
			service: process.env.SERVICE_NAME || "",
		},
		attributes: {
			connectionId: {
				type: "string",
				required: true,
			},
			listenType: {
				type: ["QUESTIONNAIRE", "SESSION"],
				required: false,
			},
			listenId: {
				type: "number",
				required: false,
			},
		},
		indexes: {
			connection: {
				pk: {
					field: "pk",
					composite: ["connectionId"],
				},
				sk: {
					field: "sk",
					composite: [],
				},
			},
			byListenTarget: {
				index: "gsi1",
				pk: {
					field: "gsi1pk",
					composite: ["listenType", "listenId"],
				},
				sk: {
					field: "gsi1sk",
					composite: ["connectionId"],
				},
			},
		},
	},
	Dynamo.Configuration,
);

export type ConnectionEntityType = EntityItem<typeof ConnectionEntity>;

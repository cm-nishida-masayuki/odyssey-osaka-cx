import { Logger } from "@aws-lambda-powertools/logger";
import { ConnectionEntity } from "./entity";

const logger = new Logger();

export async function getTargetConnections(
	listenType: string,
	listenId: number,
) {
	logger.debug(
		`Getting target connections. listenType: ${listenType}, listenId: ${listenId}`,
	);
	logger.debug(
		ConnectionEntity.query
			.byListenTarget({
				listenType: listenType,
				listenId: listenId,
			})
			.params(),
	);
	const targets = await ConnectionEntity.query
		.byListenTarget({
			listenType: listenType,
			listenId: listenId,
		})
		.go();
	logger.debug("Targets:", JSON.stringify(targets));
	return targets.data;
}

import json
import logging
from typing import Any

from gen_ai_server.rag import qa

logging.basicConfig(format="%(asctime)s %(message)s", level=logging.DEBUG)
logger = logging.getLogger()


def handler(event: dict[str, Any], _context: Any) -> dict[str, Any]:
    try:
        logger.info(event)
        body = json.loads(event["body"])
        message = body.get("message", "")

        if not message:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Message is required"}),
            }

        llm_response = qa.run(message)
        logger.info(f"llm_response: {llm_response}")

        # レスポンスを作成
        response = {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"response": llm_response}, ensure_ascii=False),
        }

        logger.info(f"Received message: {message}")
        logger.info(f"Sending response: {llm_response}")

        return response

    except Exception as e:
        logger.exception(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"}),
        }

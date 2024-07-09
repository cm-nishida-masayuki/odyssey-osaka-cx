import logging
from typing import Any

logger = logging.getLogger()

def handler(_event: dict[str, Any], _context: Any) -> dict[str, Any]:
    # TODO: Implement handler
    return {
      'statusCode': 200,
      'body': {
          'response': "生成AIに関連するセッションは、7/8(火)と7/11(木)に開催されます。"
      }
    }

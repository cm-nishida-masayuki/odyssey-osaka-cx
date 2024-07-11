import { WebSocketServer } from "ws";

const port = 8080;
const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    // エコーサーバーとして、受け取ったメッセージをクライアントに送り返す
    // ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  setInterval(() => {
    ws.send(
      JSON.stringify({
        answers: [
          {
            participantId: "1f4ebfc6-0ae0-42e3-8fa0-a9fabd5d474a",
            participantName: "参加者2",
            answerAt: "2024-07-31T05:11:00.000Z",
            choice: "Access VBA",
          },
        ],
      })
    );
  }, 1000);
});

console.log(`WebSocket server is running on ws://localhost:${port}`);

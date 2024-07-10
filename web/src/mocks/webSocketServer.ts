import { WebSocketServer } from "ws";

const port = 8080;
const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // エコーサーバーとして、受け取ったメッセージをクライアントに送り返す
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // 接続時にウェルカムメッセージを送信
  ws.send("Welcome to the WebSocket server!");
});

console.log(`WebSocket server is running on ws://localhost:${port}`);

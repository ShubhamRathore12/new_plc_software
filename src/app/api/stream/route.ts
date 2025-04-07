// Example for pages/api/stream.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Prevent request from closing
  res.flushHeaders();

  // Dummy: Ping every 10s to keep connection alive
  const keepAlive = setInterval(() => {
    res.write("event: ping\ndata: {}\n\n");
  }, 10000);

  // Simulate push when new data is inserted (you must replace this with your actual logic)
  const pushData = (data: any) => {
    res.write(`event: message\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Fake trigger: emit data every 15 seconds (simulate DB insert)
  const fakeInsertInterval = setInterval(() => {
    const fakeData = { refresh: true };
    pushData(fakeData);
  }, 15000); // Simulate data every 15s

  req.on("close", () => {
    clearInterval(keepAlive);
    clearInterval(fakeInsertInterval);
    res.end();
  });
}

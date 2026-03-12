import express from 'express';

const app = express();

app.get("/", (req, res) => {
  res.send("Express + Socket.IO server is running");
});

export default app;

import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World 2/10/23 2:52 AM!");
});

app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});

import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World 2/9/23 4:59 PM!");
});

app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});

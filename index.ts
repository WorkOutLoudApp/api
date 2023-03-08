import express from "express";

const app = express();
const PORT = 3000;

const subpath = "/api/v1/"

app.get(`${subpath}`, (req, res) => {
  res.send("Hello World 2/10/23 2:52 AM!");
});

app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});

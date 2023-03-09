import express from "express";

const app = express();
const PORT = 3000;

const subpath = "/api/v1/"

// Default route
app.get(`${subpath}`, (req, res) => {
  res.send("Hello World 3/8/23 2:52 AM!");
});

app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});

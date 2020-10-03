const express = require("express");
const app = express();

const mongoose = require("mongoose");
const port = process.env.PORT || 9000;

const connection_url =
  "mongodb+srv://KosmosDeveloper:London2002@cluster0.c6pz9.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => res.status(200).send("Hello world"));

app.listen(port, () => console.log(`Running on port:${port}`));

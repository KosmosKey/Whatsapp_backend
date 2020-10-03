import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages";

const app = express();

const port = process.env.PORT || 9000;

const connection_url =
  "mongodb+srv://KosmosDeveloper:London2002@cluster0.c6pz9.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => res.status(200).send("Hello world"));

app.post("/api/v1/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(`new message is created: ${data}`);
    }
  });
});

app.listen(port, () => console.log(`Running on port:${port}`));

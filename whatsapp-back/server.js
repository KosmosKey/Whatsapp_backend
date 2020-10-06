const mongoose = require("mongoose");
const express = require("express");
const Messages = require("./dbMessages");
const Pusher = require("pusher");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 9000;

const db = mongoose.connection;

db.once("open", () => {
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        _id: messageDetails._id,
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        recieved: messageDetails.recieved,
      });
    } else {
      console.log("Error with trigger the pusher...");
    }
  });
});

const pusher = new Pusher({
  appId: "1084390",
  key: "34c948866fd8ec957c68",
  secret: "d2fde52bc7708c963f5d",
  cluster: "eu",
  encrypted: true,
});

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const connection_url =
  "mongodb+srv://KosmosDeveloper:London2002@cluster0.c6pz9.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/messages/new", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/messages/:id", (req, res) => {
  Messages.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.delete("/:id", (req, res) => {
  Messages.findByIdAndDelete(req.params.id).then((data) => res.json(data));
});

app.listen(port, () => console.log(`Running on port:${port}`));

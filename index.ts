import * as express from "express";
import * as mongoDB from "mongodb";

const app = express();

const PORT = 54679;

const url =
  "mongodb+srv://tariq:MOIckGBctLtSewWA@database.o7wcr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

export const router = express.Router();

export const collections: { users?: mongoDB.Collection } = {};

const connectToDatabase = async () => {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(url);

  client
    .connect()
    .then((res) => {
      console.log("connection success ==> ", res);
    })
    .catch((err) => {
      console.log("connection error ==> ", err);
    });

  app.get("/", (req: express.Request, res: express.Response) => {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Hello World</h1>");
  });

  app.use(express.json());

  //post man - test
  const db: mongoDB.Db = client.db("test");

  const usersCollection: mongoDB.Collection = db.collection("users");

  collections.users = usersCollection;

  app.post("/user", async (req: any, res: any) => {
    try {
      const userData = req.body;
      const result = await collections.users.insertOne(userData);
      result
        ? res
            .status(201)
            .send(
              `Successfully created a new user with id ${result.insertedId}`
            )
        : res.status(500).send("Failed to create a new user.");
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  });

  app.listen(PORT, () => console.log(`app running on port ${PORT}`));
};

connectToDatabase()
  .then((result) => {
    console.log("result ==> ", result);
  })
  .catch((err) => {
    console.log("error ==> ", err);
  });

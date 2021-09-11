const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const UsersRoutes = require("./routes/users.js");
const CategoriesRoutes = require("./routes/categories.js");
const TopicRoutes = require("./routes/topics.js");
const RepliesRoutes = require("./routes/replies.js");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const DBURI = process.env.DBURI;

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/users", UsersRoutes);

app.use("/categories", CategoriesRoutes);

app.use("/topics", TopicRoutes);

app.use("/replies", RepliesRoutes);

app.get("/", (req, res) => res.send("nothing here for you"));

mongoose
  .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) =>
    app.listen(PORT, () => console.log(`Server started at Port ${PORT}`))
  )
  .catch((err) => console.log(err));

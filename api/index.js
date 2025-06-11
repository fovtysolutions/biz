require("dotenv").config();
const express = require("express");
const { connectDB, mongoStatus } = require("../config/db");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
connectDB();
const authroutes = require("../routes/AuthRoutes");
const testingroutes2 = require("../routes/tessstRoutes");

app.set("trust proxy", 1);
app.use(express.json({ limit: "4mb" }));

app.use("/auth/", authroutes);
app.use("/testing2/", testingroutes2);

//root route
app.get("/", (req, res) => {
  res.send(`App works properly! Mongo connection ${mongoStatus.message}`);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`server running on port ${PORT}`)
);


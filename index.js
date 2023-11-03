const express = require("express");
require('dotenv').config()
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
 
const { connection } = require("./db")
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/notes.routes");
app.use("/users", userRouter);
app.use("/notes", noteRouter)

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log(`server is running at ${process.env.PORT}`)
    } catch (error) {
        console.log(error);
    }
})
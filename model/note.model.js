const mongoose = require("mongoose");
const noteschema = mongoose.Schema({
    title: String,
    body: String,
    userID: String,
    username: String
}, {
    versionKey: false
})

const NoteModel = mongoose.model("notes", noteschema);
module.exports = {
    NoteModel
}
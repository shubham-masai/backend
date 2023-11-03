const express = require("express");
const noteRouter = express.Router();
const { NoteModel } = require("../model/note.model");
const { auth } = require("../middleware/auth.middleware");
const { rateLimiter } = require("../middleware/rateLimiter.middleware");
noteRouter.use(auth);
noteRouter.use(rateLimiter);
 
noteRouter.post("/create", async (req, res) => {
    try {
        const note = new NoteModel(req.body);
        await note.save();
        res.status(200).send({ "msg": "A new note has been added" });
    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
})
 
noteRouter.get("/:noteid?", async (req, res) => {
    const { noteid } = req.params
    try {
        if (noteid) {
            const note = await NoteModel.findOne({ _id: noteid });
            if (!note) {
                return res.status(404).send({ "msg": "Note not found" })
            }
            if (note.username == req.body.username) {
                res.status(200).send(note);
            }
        }
        else {
            const notes = await NoteModel.find({ username: req.body.username })
            return res.status(200).send(notes)
        }
    } catch (error) {
        res.status(400).send({ "error": error.message });
    }
});
 
noteRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params
    try {

        const note = await NoteModel.findOne({ _id: id });
        if (!note) {
            return res.status(404).send({ "msg": "Note not found" })
        }
        if (note.username == req.body.username) {
            await NoteModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).send({ "msg": "Note has been updated" });
        }
        else {
            res.status(200).send({ "msg": "you are not authorized to update it" });
        }
    }
    catch (error) {
        res.status(400).send({ "error": error.message })
    }
})

noteRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params
    try {
        const note = await NoteModel.findOne({ _id: id });
        if (!note) {
            return res.status(404).send({ "msg": "Note not found" })
        }
        if (note.username === req.body.username) {
            await NoteModel.findByIdAndDelete({ _id: id });
            res.status(200).send({ "msg": "Note has been deleted" });
        }
        else {
            res.status(200).send({ "msg": "you are not authorized to delete it" });
        }
    }
    catch (error) {
        res.status(400).send({ "error": error.message })
    }
})
module.exports = {
    noteRouter
}
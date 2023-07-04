const router = require("express").Router()
const Todo = require("../models/Todo");

// routes will be here....
router.get("/", async (req, res) => {
    const allTodo = await Todo.find().maxTimeMS(20000);
    res.render("index", { todo: allTodo })
})


module.exports = router;
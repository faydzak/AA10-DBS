import * as todoService from "../service/todosService.js";



export const getAll = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.json(todos);
  } catch (err) {
    console.error("[TodoController] getAll:", err.message);
    res.status(err.status || 500).json({ error: err.message || "Failed to fetch todos" });
  }
};

export const create = async (req, res) => {
  try {
    const todo = await todoService.createTodo(req.body.task);
    res.status(201).json(todo);
  } catch (err) {
    console.error("[TodoController] create:", err.message);
    res.status(err.status || 500).json({ error: err.message || "Failed to create todo" });
  }
};

export const remove = async (req, res) => {
  try {
    await todoService.deleteTodo(req.params.id);
    res.status(204).send();
  } catch (err) {
    // Mongoose CastError means the id string is not a valid ObjectId
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid id format" });
    }
    console.error("[TodoController] remove:", err.message);
    res.status(err.status || 500).json({ error: err.message || "Failed to delete todo" });
  }
};
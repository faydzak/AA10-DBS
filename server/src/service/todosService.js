import * as todoRepository from "../repository/todosRepository.js";



export const getAllTodos = () =>
  todoRepository.findAll();

export const createTodo = async (task) => {
  if (!task || typeof task !== "string" || task.trim() === "") {
    const err = new Error("task is required and must be a non-empty string");
    err.status = 400;
    throw err;
  }

  return todoRepository.create(task.trim());
};

export const deleteTodo = async (id) => {

  const deleted = await todoRepository.deleteById(id);

  if (!deleted) {
    const err = new Error("Todo not found");
    err.status = 404;
    throw err;
  }

  return deleted;
};
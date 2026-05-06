import Todo from "../models/todosModels.js";
 
/**
 * Repository layer — the only place that directly touches the database.
 * No business logic here; just raw CRUD operations via Mongoose.
 */
 
export const findAll = () =>
  Todo.find().sort({ created_at: -1 });
 
export const findById = (id) =>
  Todo.findById(id);
 
export const create = (task) =>
  Todo.create({ task });
 
export const deleteById = (id) =>
  Todo.findByIdAndDelete(id);
 
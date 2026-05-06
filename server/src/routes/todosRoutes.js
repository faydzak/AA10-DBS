import { Router } from "express";
import * as todoController from "../controller/todosController.js";
 
const router = Router();
 
router.get("/",     todoController.getAll);
router.post("/",     todoController.create);
router.delete("/:id", todoController.remove);
 
export default router;
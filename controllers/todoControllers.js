import todos from "../models/todos.model.js";

export async function addTodo(req, res) {
  const {
    title,
    discription,
    todoType,
    priority,
    isImportent,
    isUrgent,
    completionDate,
  } = req.body;

  try {
    if (!title) return res.status(400).json({ message: "title is required" });

    const todo = await todos.create({
      title,
      discription,
      todoType,
      priority,
      isImportent,
      isUrgent,
      completionDate,
    });

    res.status(201).json({ message: "Todo created successfully", todo: todo });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error: Please try leter" });
  }
}

export async function getTodos(req, res) {
  try {
    const data = await todos.find({});
    res.status(200).json({ todos: data });
  } catch (err) {
    res.status(500).json({ message: "Can not get todos", err: err.message });
  }
}

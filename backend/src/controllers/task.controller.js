import Task from '../models/task.model.js';
import mongoose from 'mongoose';

const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;
        const userId = req.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid Task ID." });
        }
        if (!title || !description || !dueDate) {
            return res.status(400).json({ message: "Title, description, and due date are required." });
        }

        const task = new Task({
            userId,
            title,
            description,
            dueDate,
            priority,
        });

        const savedTask = await task.save();
        res.status(201).json({
            message: "Task created successfully.",
            task: savedTask,
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Server error while creating task." });
    }
}

const getTask = async (req, res) => {
    try {
        const userId = req.userId;
        const tasks = await Task.find({ userId });

        res.status(200).json({
            message: "Tasks fetched successfully.",
            tasks,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error while fetching tasks." });
    }
}

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { title, description, dueDate, priority, status } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Task ID." });
        }
        const task = await Task.findOne({ _id: id, userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;

        const updatedTask = await task.save();
        res.status(200).json({
            message: "Task updated successfully.",
            task: updatedTask,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error while updating task." });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Task ID." });
        }

        const deletedTask = await Task.findOneAndDelete({ _id: id, userId });

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found or not authorized." });
        }

        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error while deleting task." });
    }
};

export { createTask, getTask, updateTask, deleteTask };
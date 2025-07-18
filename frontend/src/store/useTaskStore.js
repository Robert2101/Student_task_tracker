import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
import { toast } from "react-hot-toast";
const BASE_URL = "http://localhost:5001";

export const useTaskStore = create((set) => ({
    // Tasks Display
    //Status and update and delete
    tasks: [],
    loading: false,
    fetchTasks: async () => {
        set({ loading: true });
        try {
            const res = await axios.get(`${BASE_URL}/api/tasks/get-tasks`, { withCredentials: true });
            set({ tasks: res.data.tasks });
        } catch (err) {
            toast.error("Failed to fetch tasks");
        } finally {
            set({ loading: false });
        }
    },
    deleteTask: async (taskId) => {
        try {
            await axios.delete(`${BASE_URL}/api/tasks/delete-task/${taskId}`, { withCredentials: true });
            set((state) => ({
                tasks: state.tasks.filter((task) => task._id !== taskId),
            }));
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    },
    updateTask: async (taskId, updatedData) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/tasks/update-task/${taskId}`, updatedData, { withCredentials: true });
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? { ...task, ...res.data.task } : task
                ),
            }));
            toast.success("Task updated successfully");
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
        }
    },
    createTask: async (taskData) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/tasks/create-task`, taskData, { withCredentials: true });
            set((state) => ({
                tasks: [...state.tasks, res.data.task],
            }));
            toast.success("Task created successfully");
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Failed to create task");
        }
    },
}));
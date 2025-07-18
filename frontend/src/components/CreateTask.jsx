// CreateTask.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';

const CreateTask = ({ onCreateTask, onClose }) => {
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'low',
    });

    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewTaskDateChange = (date) => {
        setNewTask((prev) => ({ ...prev, dueDate: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.description || !newTask.dueDate) {
            toast.error("Please fill in all required fields for the new task.");
            return;
        }
        await onCreateTask(newTask);
        setNewTask({
            title: '',
            description: '',
            dueDate: new Date(),
            priority: 'low',
        });
        onClose(); // Close the modal after successful creation
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl relative w-full max-w-md mx-auto">
                <button
                    // FIX: Increased z-index to ensure it's always on top of other elements, especially other close buttons
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-50" // Added z-50 here
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="new-task-title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="new-task-title"
                            name="title"
                            value={newTask.title}
                            onChange={handleNewTaskChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-task-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="new-task-description"
                            name="description"
                            value={newTask.description}
                            onChange={handleNewTaskChange}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="new-task-dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                        <DatePicker
                            selected={newTask.dueDate}
                            onChange={handleNewTaskDateChange}
                            dateFormat="yyyy/MM/dd"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-task-priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            id="new-task-priority"
                            name="priority"
                            value={newTask.priority}
                            onChange={handleNewTaskChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
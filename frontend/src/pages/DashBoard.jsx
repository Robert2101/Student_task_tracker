import React, { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore.js';
import { Toaster, toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CreateTask from '../components/CreateTask.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuthStore } from '../store/useAuthStore.js';


const DashBoard = () => {
    const { tasks, loading, fetchTasks, deleteTask, updateTask, createTask } = useTaskStore();
    const { logout } = useAuthStore();

    const [editingTask, setEditingTask] = useState(null);
    const [updatedTaskData, setUpdatedTaskData] = useState({
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'low',
        status: 'pending',
    });

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterDueDate, setFilterDueDate] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filteredTasks = useMemo(() => {
        let currentTasks = tasks;

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentTasks = currentTasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                    task.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        if (filterStatus !== 'all') {
            currentTasks = currentTasks.filter((task) => task.status === filterStatus);
        }

        if (filterPriority !== 'all') {
            currentTasks = currentTasks.filter((task) => task.priority === filterPriority);
        }

        if (filterDueDate) {
            const selectedDateString = filterDueDate.toDateString();
            currentTasks = currentTasks.filter(
                (task) => new Date(task.dueDate).toDateString() === selectedDateString
            );
        }

        return currentTasks;
    }, [tasks, searchTerm, filterStatus, filterPriority, filterDueDate]);

    const handleEditClick = (task) => {
        setEditingTask(task._id);
        setUpdatedTaskData({
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate),
            priority: task.priority,
            status: task.status,
        });
    };

    const handleUpdateTaskChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTaskData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateTaskDateChange = (date) => {
        setUpdatedTaskData((prev) => ({ ...prev, dueDate: date }));
    };

    const handleUpdateTask = async (taskId) => {
        if (!updatedTaskData.title || !updatedTaskData.description || !updatedTaskData.dueDate) {
            toast.error("Please fill in all required fields for the task update.");
            return;
        }
        await updateTask(taskId, updatedTaskData);
        setEditingTask(null);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    const handleDeleteTask = async (taskId) => {
        await deleteTask(taskId);
    };

    const handleCreateTaskInDashboard = async (taskData) => {
        await createTask(taskData);
    };

    const handleLogout = async () => {
        await logout();
        // Redirect logic here, e.g., using react-router-dom's navigate('/')
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center relative">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Sidebar Toggle Button - Now hidden when sidebar is open */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className={`fixed top-4 left-4 z-50 p-3 rounded-full bg-gray-700 text-white shadow-lg hover:bg-gray-900 transition duration-300 ease-in-out ${isSidebarOpen ? 'hidden' : ''}`} // Added conditional 'hidden' class
                aria-label="Open Sidebar"
            >
                {/* Menu icon - Always displayed when button is visible */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            {/* Sidebar Component */}
            <Sidebar tasks={tasks} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Content overlay when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content, pushed to the right when sidebar is open */}
            <div className={`w-full flex flex-col items-center ${isSidebarOpen ? 'md:ml-64' : ''} transition-all duration-300 ease-in-out`}>
                {/* Header and Action Buttons */}
                <div className="w-full max-w-4xl flex justify-between items-center mb-8 mt-4">
                    <h1 className="text-4xl font-bold text-gray-800">Task Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowCreateTaskModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        >
                            Add New Task
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Filter & Search Tasks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by Name/Description</label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="e.g., 'Meeting' or 'Project'"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                            <select
                                id="filter-status"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filter-priority" className="block text-sm font-medium text-gray-700">Filter by Priority</label>
                            <select
                                id="filter-priority"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="all">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filter-dueDate" className="block text-sm font-medium text-gray-700">Filter by Due Date</label>
                            <DatePicker
                                selected={filterDueDate}
                                onChange={(date) => setFilterDueDate(date)}
                                dateFormat="yyyy/MM/dd"
                                isClearable
                                placeholderText="Select a due date"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Create New Task Modal (conditionally rendered) */}
                {showCreateTaskModal && (
                    <CreateTask
                        onCreateTask={handleCreateTaskInDashboard}
                        onClose={() => setShowCreateTaskModal(false)}
                    />
                )}

                {/* Task List Section */}
                <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Tasks</h2>
                    {loading ? (
                        <p className="text-center text-gray-600">Loading tasks...</p>
                    ) : filteredTasks.length === 0 ? (
                        <p className="text-center text-gray-600">No tasks found matching your criteria. 😔</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
                                >
                                    {editingTask === task._id ? (
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor={`edit-title-${task._id}`} className="block text-xs font-medium text-gray-500">Title</label>
                                                <input
                                                    type="text"
                                                    id={`edit-title-${task._id}`}
                                                    name="title"
                                                    value={updatedTaskData.title}
                                                    onChange={handleUpdateTaskChange}
                                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`edit-description-${task._id}`} className="block text-xs font-medium text-gray-500">Description</label>
                                                <textarea
                                                    id={`edit-description-${task._id}`}
                                                    name="description"
                                                    value={updatedTaskData.description}
                                                    onChange={handleUpdateTaskChange}
                                                    rows="1"
                                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                    required
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label htmlFor={`edit-dueDate-${task._id}`} className="block text-xs font-medium text-gray-500">Due Date</label>
                                                <DatePicker
                                                    selected={updatedTaskData.dueDate}
                                                    onChange={handleUpdateTaskDateChange}
                                                    dateFormat="yyyy/MM/dd"
                                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`edit-priority-${task._id}`} className="block text-xs font-medium text-gray-500">Priority</label>
                                                <select
                                                    id={`edit-priority-${task._id}`}
                                                    name="priority"
                                                    value={updatedTaskData.priority}
                                                    onChange={handleUpdateTaskChange}
                                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor={`edit-status-${task._id}`} className="block text-xs font-medium text-gray-500">Status</label>
                                                <select
                                                    id={`edit-status-${task._id}`}
                                                    name="status"
                                                    value={updatedTaskData.status}
                                                    onChange={handleUpdateTaskChange}
                                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                            <div className="flex space-x-2 mt-4 md:mt-0 md:col-span-2 justify-end">
                                                <button
                                                    onClick={() => handleUpdateTask(task._id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 text-sm"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                                                <p className="text-gray-600 text-sm">{task.description}</p>
                                                <p className="text-gray-500 text-xs mt-1">
                                                    Due: {new Date(task.dueDate).toLocaleDateString()} | Priority: <span className={`font-medium ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{task.priority}</span> | Status: <span className={`font-medium ${task.status === 'completed' ? 'text-green-700' : 'text-orange-600'}`}>{task.status}</span>
                                                </p>
                                            </div>
                                            <div className="flex space-x-2 mt-3 md:mt-0">
                                                <button
                                                    onClick={() => handleEditClick(task)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
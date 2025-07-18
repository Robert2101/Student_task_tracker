// Sidebar.jsx
import React from 'react';

const Sidebar = ({ tasks, isOpen, onClose }) => {
    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999); // Normalize to end of 7th day

    const upcomingDeadlines = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
        return task.status === 'pending' && dueDate >= today && dueDate <= sevenDaysFromNow;
    }).length;

    return (
        <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-5 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
                &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 mt-4">Task Summary</h2>
            <ul className="space-y-4">
                <li>
                    <span className="font-semibold">Total Tasks:</span> {totalTasks}
                </li>
                <li>
                    <span className="font-semibold">Completed Tasks:</span> {completedTasks}
                </li>
                <li>
                    <span className="font-semibold">Pending Tasks:</span> {pendingTasks}
                </li>
                <li>
                    <span className="font-semibold">Upcoming Deadlines (7 days):</span> {upcomingDeadlines}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
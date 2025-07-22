import React, { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore.js';
import { Toaster, toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker'; // Keep this for now, but its styling is overridden
import 'react-datepicker/dist/react-datepicker.css'; // Keep this for base styles
import CreateTask from '../components/CreateTask.jsx';
import Sidebar from '../components/Sidebar.jsx'; // Your existing Sidebar component
import { useAuthStore } from '../store/useAuthStore.js';
import {
    Loader,
    Menu,
    Calendar as CalendarIcon,
    PlusCircle,
    LogOut,
    Search,
    Filter,
    ListTodo, // For total tasks icon
    CheckCircle, // For completed tasks icon
    Hourglass, // For pending tasks icon
    Clock, // For upcoming deadlines icon
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar'; // Shadcn Calendar for styling DatePicker
import { Separator } from '@/components/ui/separator'; // For visual breaks
import { Badge } from '@/components/ui/badge'; // For status/priority display
import { cn } from '@/lib/utils'; // Utility for conditional class names
import { format } from 'date-fns'; // For date formatting in Popover trigger

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

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

    // Statistics for the dashboard summary cards
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    const upcomingDeadlines = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return task.status === 'pending' && dueDate >= today && dueDate <= sevenDaysFromNow;
    }).length;


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
        // Redirect logic handled by App.jsx's Route protection
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex"> {/* Main flex container */}
            {/* Sidebar Component (Desktop fixed, Mobile Sheet) */}
            {/* <Sidebar tasks={tasks} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /> */}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
                {/* Header Section */}
                <header className="flex justify-between items-center mb-8 pb-4 border-b border-border sticky top-0 bg-background z-10">
                    {/* Mobile Sidebar Toggle Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden mr-4" // Only show on mobile
                        aria-label="Open Sidebar"
                    >
                        {/* <Menu className="h-6 w-6" /> */}
                    </Button>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary flex-1">Task Dashboard</h1>
                    <div className="flex space-x-3 md:space-x-4">
                        {/* Add New Task Button with Dialog Trigger */}
                        <Dialog open={showCreateTaskModal} onOpenChange={setShowCreateTaskModal}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Task</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details for your new task.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateTask
                                    onCreateTask={handleCreateTaskInDashboard}
                                    onClose={() => setShowCreateTaskModal(false)}
                                />
                            </DialogContent>
                        </Dialog>

                        {/* Logout Button */}
                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </header>

                {/* Statistics Overview Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Your Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold">{totalTasks}</CardTitle>
                                <CardDescription>Total Tasks</CardDescription>
                            </div>
                            <ListTodo className="h-8 w-8 text-primary" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold text-green-500">{completedTasks}</CardTitle>
                                <CardDescription>Completed</CardDescription>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold text-orange-500">{pendingTasks}</CardTitle>
                                <CardDescription>Pending</CardDescription>
                            </div>
                            <Hourglass className="h-8 w-8 text-orange-500" />
                        </Card>
                        <Card className="p-4 flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold text-destructive">{upcomingDeadlines}</CardTitle>
                                <CardDescription>Upcoming (7 days)</CardDescription>
                            </div>
                            <Clock className="h-8 w-8 text-destructive" />
                        </Card>
                    </div>
                </section>

                {/* Search and Filter Section */}
                <section className="mb-8">
                    <Card className="p-6">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle className="text-2xl">Filter & Search Tasks</CardTitle>
                            <CardDescription>Refine your task list by searching or applying filters.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search Field */}
                                <div className="grid gap-2">
                                    <Label htmlFor="search">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by title or description..."
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                {/* Filter by Status */}
                                <div className="grid gap-2">
                                    <Label htmlFor="filter-status">Status</Label>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger id="filter-status">
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filter by Priority */}
                                <div className="grid gap-2">
                                    <Label htmlFor="filter-priority">Priority</Label>
                                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                                        <SelectTrigger id="filter-priority">
                                            <SelectValue placeholder="All Priorities" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filter by Due Date (Shadcn Popover + DatePicker) */}
                                <div className="grid gap-2">
                                    <Label htmlFor="filter-dueDate">Due Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !filterDueDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filterDueDate ? format(filterDueDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={filterDueDate}
                                                onSelect={setFilterDueDate}
                                                initialFocus
                                            />
                                            {filterDueDate && (
                                                <div className="p-2 border-t flex justify-end">
                                                    <Button variant="ghost" onClick={() => setFilterDueDate(null)} className="h-8 px-2">
                                                        Clear Date
                                                    </Button>
                                                </div>
                                            )}
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Task List Section */}
                <section>
                    <Card className="p-6">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle className="text-2xl">Your Tasks</CardTitle>
                            <CardDescription>Manage your pending and completed tasks efficiently.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader className="size-8 animate-spin text-primary" />
                                    <p className="ml-2 text-muted-foreground">Loading tasks...</p>
                                </div>
                            ) : filteredTasks.length === 0 ? (
                                <p className="text-center text-muted-foreground p-8">
                                    No tasks found matching your criteria. 😔
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {filteredTasks.map((task) => (
                                        <Card
                                            key={task._id}
                                            className="p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
                                        >
                                            {editingTask === task._id ? (
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Edit Task Fields */}
                                                    <div className="grid gap-2">
                                                        <Label htmlFor={`edit-title-${task._id}`}>Title</Label>
                                                        <Input
                                                            id={`edit-title-${task._id}`}
                                                            name="title"
                                                            value={updatedTaskData.title}
                                                            onChange={handleUpdateTaskChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor={`edit-description-${task._id}`}>Description</Label>
                                                        <Input
                                                            as="textarea" // Use Input component, but render as textarea
                                                            id={`edit-description-${task._id}`}
                                                            name="description"
                                                            value={updatedTaskData.description}
                                                            onChange={handleUpdateTaskChange}
                                                            rows="1"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor={`edit-dueDate-${task._id}`}>Due Date</Label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full justify-start text-left font-normal",
                                                                        !updatedTaskData.dueDate && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {updatedTaskData.dueDate ? format(updatedTaskData.dueDate, "PPP") : <span>Pick a date</span>}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={updatedTaskData.dueDate}
                                                                    onSelect={handleUpdateTaskDateChange}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor={`edit-priority-${task._id}`}>Priority</Label>
                                                        <Select
                                                            value={updatedTaskData.priority}
                                                            onValueChange={(value) => handleUpdateTaskChange({ target: { name: 'priority', value } })}
                                                        >
                                                            <SelectTrigger id={`edit-priority-${task._id}`}>
                                                                <SelectValue placeholder="Select Priority" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="low">Low</SelectItem>
                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                <SelectItem value="high">High</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor={`edit-status-${task._id}`}>Status</Label>
                                                        <Select
                                                            value={updatedTaskData.status}
                                                            onValueChange={(value) => handleUpdateTaskChange({ target: { name: 'status', value } })}
                                                        >
                                                            <SelectTrigger id={`edit-status-${task._id}`}>
                                                                <SelectValue placeholder="Select Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="completed">Completed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex space-x-2 mt-4 md:mt-0 md:col-span-2 justify-end">
                                                        <Button onClick={() => handleUpdateTask(task._id)} size="sm">
                                                            Save
                                                        </Button>
                                                        <Button variant="outline" onClick={handleCancelEdit} size="sm">
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                                                        <p className="text-muted-foreground text-sm">{task.description}</p>
                                                        <p className="text-muted-foreground text-xs mt-1">
                                                            Due: {new Date(task.dueDate).toLocaleDateString()} | Priority:{" "}
                                                            <Badge
                                                                variant={
                                                                    task.priority === 'high' ? 'destructive' :
                                                                        task.priority === 'medium' ? 'secondary' :
                                                                            'outline'
                                                                }
                                                                className={cn(
                                                                    task.priority === 'high' && 'bg-destructive/10 text-destructive',
                                                                    task.priority === 'medium' && 'bg-orange-500/10 text-orange-500',
                                                                    task.priority === 'low' && 'bg-green-500/10 text-green-500'
                                                                )}
                                                            >
                                                                {task.priority}
                                                            </Badge>{" "}
                                                            | Status:{" "}
                                                            <Badge
                                                                variant={task.status === 'completed' ? 'default' : 'secondary'}
                                                                className={cn(
                                                                    task.status === 'completed' && 'bg-green-600/10 text-green-600',
                                                                    task.status === 'pending' && 'bg-orange-600/10 text-orange-600'
                                                                )}
                                                            >
                                                                {task.status}
                                                            </Badge>
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2 mt-3 md:mt-0">
                                                        <Button variant="outline" onClick={() => handleEditClick(task)} size="sm">
                                                            Edit
                                                        </Button>
                                                        <Button variant="destructive" onClick={() => handleDeleteTask(task._id)} size="sm">
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
};

export default DashBoard;

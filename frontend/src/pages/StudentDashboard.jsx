import React, { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore.js';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore.js';
import {
    Loader,
    Menu,
    Calendar as CalendarIcon,
    PlusCircle,
    LogOut,
    Search,
    Edit,
    Trash2,
} from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import CreateTask from '../components/CreateTask.jsx';
import Sidebar from '../components/Sidebar.jsx';

const StudentDashboard = () => {
    const { tasks, loading, fetchTasks, deleteTask, updateTask, createTask } = useTaskStore();
    const { authUser, logout } = useAuthStore();

    const [editingTask, setEditingTask] = useState(null);
    const [updatedTaskData, setUpdatedTaskData] = useState({
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'low',
        status: 'pending',
    });

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open on desktop

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    useEffect(() => {
        if (authUser) {
            fetchTasks();
        }
    }, [fetchTasks, authUser]);

    const sidebarStats = useMemo(() => {
        const personalTasks = tasks.filter(t => t.createdBy?._id === authUser?.id);
        const instructorTasks = tasks.filter(t => t.createdBy?._id !== authUser?.id);
        return {
            personal: {
                total: personalTasks.length,
                completed: personalTasks.filter(t => t.status === 'completed').length,
                pending: personalTasks.filter(t => t.status === 'pending').length,
            },
            instructor: {
                total: instructorTasks.length,
                completed: instructorTasks.filter(t => t.status === 'completed').length,
                pending: instructorTasks.filter(t => t.status === 'pending').length,
            }
        }
    }, [tasks, authUser?.id]);

    const filteredTasks = useMemo(() => {
        let currentTasks = tasks;
        if (searchTerm) {
            currentTasks = currentTasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterStatus !== 'all') {
            currentTasks = currentTasks.filter(task => task.status === filterStatus);
        }
        if (filterPriority !== 'all') {
            currentTasks = currentTasks.filter(task => task.priority === filterPriority);
        }
        return currentTasks;
    }, [tasks, searchTerm, filterStatus, filterPriority]);

    const getTaskPermissions = (task) => {
        const isPersonal = task.createdBy?._id === authUser?.id && task.assignedTo?._id === authUser?.id;
        return { canEdit: isPersonal, canDelete: isPersonal };
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setUpdatedTaskData({
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate),
            priority: task.priority,
            status: task.status,
        });
    };

    const handleUpdateTask = async () => {
        if (!editingTask) return;
        await updateTask(editingTask._id, updatedTaskData);
        setEditingTask(null);
        toast.success("Personal task updated!");
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure?")) {
            await deleteTask(taskId);
        }
    };

    const handleCreateTaskInDashboard = async (taskData) => {
        await createTask(taskData);
        setShowCreateTaskModal(false);
    };

    const handleLogout = async () => await logout();

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userRole={authUser?.role}
                stats={sidebarStats}
            />

            {/* **THE FIX IS HERE**: Main content now has dynamic margin to adjust for the sidebar */}
            <main
                className={cn(
                    "flex-1 flex flex-col p-4 md:p-8 overflow-y-auto transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "md:ml-72" : "md:ml-0"
                )}
            >
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b">
                    <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                        {/* **THE FIX IS HERE**: Toggle button is always visible */}
                        <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4">
                            <Menu />
                        </Button>
                        <h1 className="text-3xl font-bold text-primary">Student Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                        <Dialog open={showCreateTaskModal} onOpenChange={setShowCreateTaskModal}>
                            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add Personal Task</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Personal Task</DialogTitle>
                                </DialogHeader>
                                <CreateTask onCreateTask={handleCreateTaskInDashboard} onClose={() => setShowCreateTaskModal(false)} userRole={authUser.role} />
                            </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
                    </div>
                </header>

                <Card className="p-6 mb-8">
                    <CardHeader className="p-0 pb-4"><CardTitle className="text-xl">Filter & Search Tasks</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="search">Search</Label>
                                <Input id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="filter-status">Status</Label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="filter-priority">Priority</Label>
                                <Select value={filterPriority} onValueChange={setFilterPriority}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <section>
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl">Your Tasks</CardTitle>
                    </CardHeader>
                    {loading ? <div className="text-center p-8"><Loader className="mx-auto animate-spin" /></div> : !filteredTasks.length ? <p className="text-center text-muted-foreground p-8">No tasks found.</p> : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredTasks.map((task) => {
                                const permissions = getTaskPermissions(task);
                                return (
                                    <Card key={task._id} className="flex flex-col justify-between">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{task.title}</CardTitle>
                                            <CardDescription className="pt-2">{task.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="text-xs text-muted-foreground">
                                                <span>{permissions.canEdit ? "Personal Task" : `Assigned by: ${task.createdBy?.name}`}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Status:</span>
                                                <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>{task.status}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Due Date:</span>
                                                <span>{format(new Date(task.dueDate), "PPP")}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Priority:</span>
                                                <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>{task.priority}</Badge>
                                            </div>
                                        </CardContent>
                                        {permissions.canEdit && (
                                            <div className="flex items-center justify-end p-4 border-t space-x-2">
                                                <Button onClick={() => handleEditClick(task)} size="sm" variant="secondary"><Edit className="h-4 w-4" /></Button>
                                                <Button onClick={() => handleDeleteTask(task._id)} size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* Edit Dialog */}
                <Dialog open={!!editingTask} onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Edit Personal Task</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2"><Label>Title</Label><Input value={updatedTaskData.title} onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, title: e.target.value })} /></div>
                            <div className="grid gap-2"><Label>Description</Label><Input value={updatedTaskData.description} onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, description: e.target.value })} /></div>
                            <div className="grid gap-2">
                                <Label>Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild><Button variant="outline"><CalendarIcon className="mr-2 h-4 w-4" />{format(new Date(updatedTaskData.dueDate), "PPP")}</Button></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={new Date(updatedTaskData.dueDate)} onSelect={(date) => setUpdatedTaskData({ ...updatedTaskData, dueDate: date })} /></PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label>Priority</Label>
                                <Select value={updatedTaskData.priority} onValueChange={(value) => setUpdatedTaskData({ ...updatedTaskData, priority: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={updatedTaskData.status} onValueChange={(value) => setUpdatedTaskData({ ...updatedTaskData, status: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem><SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                            <Button onClick={handleUpdateTask}>Save</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default StudentDashboard;
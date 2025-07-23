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
    GraduationCap
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
import { ScrollArea } from '@/components/ui/scroll-area';

const InstructorDashboard = () => {
    const { tasks, loading, fetchTasks, deleteTask, updateTask, createTask } = useTaskStore();
    const { authUser, logout } = useAuthStore();

    const [editingTask, setEditingTask] = useState(null);
    const [updatedTaskData, setUpdatedTaskData] = useState({
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'low',
    });

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open on desktop

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');

    useEffect(() => {
        if (authUser) {
            fetchTasks();
        }
    }, [fetchTasks, authUser]);

    const groupedTasks = useMemo(() => {
        const taskGroups = new Map();
        const instructorTasks = tasks.filter(task => task.createdBy?._id === authUser?.id);

        instructorTasks.forEach(task => {
            const groupKey = `${task.title}::${task.description}::${new Date(task.dueDate).toISOString()}`;
            if (!taskGroups.has(groupKey)) {
                taskGroups.set(groupKey, {
                    groupKey, title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority, instances: []
                });
            }
            if (task.assignedTo) {
                taskGroups.get(groupKey).instances.push({
                    taskId: task._id, studentName: task.assignedTo.name, studentId: task.assignedTo._id, status: task.status
                });
            }
        });

        let finalTasks = Array.from(taskGroups.values());

        if (searchTerm) {
            finalTasks = finalTasks.filter(group => {
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                const titleMatch = group.title.toLowerCase().includes(lowerCaseSearchTerm);
                const studentMatch = group.instances.some(instance => instance.studentName.toLowerCase().includes(lowerCaseSearchTerm));
                return titleMatch || studentMatch;
            });
        }
        if (filterPriority !== 'all') {
            finalTasks = finalTasks.filter(group => group.priority === filterPriority);
        }
        return finalTasks;
    }, [tasks, searchTerm, filterPriority, authUser?.id]);

    const sidebarStats = useMemo(() => {
        if (!authUser || !tasks || tasks.length === 0) return {};
        const instructorTasks = tasks.filter(task => task.createdBy?._id === authUser.id);
        const studentSet = new Set(instructorTasks.map(t => t.assignedTo?._id));
        return {
            totalTasksAssigned: groupedTasks.length,
            totalStudents: studentSet.size,
            totalCompleted: instructorTasks.filter(t => t.status === 'completed').length,
            totalPending: instructorTasks.filter(t => t.status === 'pending').length,
        };
    }, [tasks, authUser, groupedTasks]);

    const handleEditClick = (taskGroup) => {
        setEditingTask(taskGroup);
        setUpdatedTaskData({
            title: taskGroup.title, description: taskGroup.description, dueDate: new Date(taskGroup.dueDate), priority: taskGroup.priority
        });
    };

    const handleUpdateGroupTask = async () => {
        if (!editingTask) return;
        const updatePromises = editingTask.instances.map(instance => updateTask(instance.taskId, updatedTaskData));
        await Promise.all(updatePromises);
        setEditingTask(null);
        toast.success("Task group updated successfully!");
    };

    const handleUpdateStudentStatus = async (taskId, newStatus) => {
        await updateTask(taskId, { status: newStatus });
        toast.success(`Student's status marked as ${newStatus}`);
    };

    const handleDeleteGroup = async (taskGroup) => {
        if (window.confirm(`Delete "${taskGroup.title}" for all students?`)) {
            const deletePromises = taskGroup.instances.map(instance => deleteTask(instance.taskId));
            await Promise.all(deletePromises);
            toast.success("Task group deleted successfully.");
        }
    };

    const handleCreateTask = async (taskData) => {
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
                        <h1 className="text-3xl font-bold text-primary">Instructor Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                        <Dialog open={showCreateTaskModal} onOpenChange={setShowCreateTaskModal}>
                            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Assign Task</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Assign New Task</DialogTitle></DialogHeader>
                                <CreateTask onCreateTask={handleCreateTask} onClose={() => setShowCreateTaskModal(false)} userRole={authUser.role} />
                            </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
                    </div>
                </header>

                <Card className="p-6 mb-8">
                    <CardHeader className="p-0 pb-4"><CardTitle className="text-xl">Filter Tasks</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="search">Search by Title or Student</Label>
                                <Input id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
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
                        <CardTitle className="text-2xl">Assigned Task Groups</CardTitle>
                    </CardHeader>
                    {loading ? <div className="text-center p-8"><Loader className="mx-auto animate-spin" /></div> : !groupedTasks.length ? <p className="text-center text-muted-foreground p-8">No tasks found.</p> : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {groupedTasks.map((group) => (
                                <Card key={group.groupKey} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{group.title}</CardTitle>
                                                <CardDescription className="pt-2">{group.description}</CardDescription>
                                            </div>
                                            <Badge variant={group.priority === 'high' ? 'destructive' : 'secondary'}>{group.priority}</Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground pt-2">Due: {format(new Date(group.dueDate), "PPP")}</div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <Label className="text-xs font-semibold">Student Progress</Label>
                                        <ScrollArea className="h-40 w-full rounded-md border mt-2">
                                            <div className="p-4 space-y-3">
                                                {group.instances.map(instance => (
                                                    <div key={instance.studentId} className="flex items-center justify-between text-sm">
                                                        <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />{instance.studentName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={instance.status === 'completed' ? 'default' : 'outline'}>{instance.status}</Badge>
                                                            <Button size="sm" variant="ghost" onClick={() => handleUpdateStudentStatus(instance.taskId, instance.status === 'pending' ? 'completed' : 'pending')}>Toggle</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                    <div className="flex items-center justify-end p-4 border-t space-x-2">
                                        <Button onClick={() => handleEditClick(group)} size="sm" variant="secondary"><Edit className="mr-2 h-4 w-4" />Edit</Button>
                                        <Button onClick={() => handleDeleteGroup(group)} size="sm" variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                <Dialog open={!!editingTask} onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Edit Task Group</DialogTitle></DialogHeader>
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
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                            <Button onClick={handleUpdateGroupTask}>Save for All</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default InstructorDashboard;
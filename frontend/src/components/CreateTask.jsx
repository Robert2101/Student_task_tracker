import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Still needed for its core functionality
import 'react-datepicker/dist/react-datepicker.css'; // Keep for base styles
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon } from 'lucide-react'; // Calendar icon

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar'; // Shadcn Calendar for styling
import { cn } from '@/lib/utils'; // Utility for conditional class names
import { format } from 'date-fns'; // For date formatting

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
        // Removed the outer fixed inset-0 div as DialogContent handles the modal overlay
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Title Field */}
            <div className="grid gap-2">
                <Label htmlFor="new-task-title">Title</Label>
                <Input
                    id="new-task-title"
                    name="title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                    placeholder="e.g., Complete React Project"
                    required
                />
            </div>

            {/* Description Field */}
            <div className="grid gap-2">
                <Label htmlFor="new-task-description">Description</Label>
                <Input
                    as="textarea" // Render as textarea
                    id="new-task-description"
                    name="description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                    rows="3"
                    placeholder="Detailed description of the task..."
                    required
                />
            </div>

            {/* Due Date Field */}
            <div className="grid gap-2">
                <Label htmlFor="new-task-dueDate">Due Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !newTask.dueDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={newTask.dueDate}
                            onSelect={handleNewTaskDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Priority Field */}
            <div className="grid gap-2">
                <Label htmlFor="new-task-priority">Priority</Label>
                <Select
                    value={newTask.priority}
                    onValueChange={(value) => handleNewTaskChange({ target: { name: 'priority', value } })}
                >
                    <SelectTrigger id="new-task-priority">
                        <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-4">
                Add Task
            </Button>
        </form>
    );
};

export default CreateTask;

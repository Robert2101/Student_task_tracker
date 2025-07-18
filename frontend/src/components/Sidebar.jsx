import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription, // Optional, but good for context
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Close icon

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
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-64 bg-card text-card-foreground p-5 flex flex-col">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold mt-4">Task Summary</SheetTitle>
                    <SheetDescription>
                        A quick overview of your task statistics.
                    </SheetDescription>
                </SheetHeader>

                <ul className="space-y-4 flex-grow"> {/* flex-grow to push close button to bottom if needed */}
                    <li className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Total Tasks:</span> <span className="text-primary">{totalTasks}</span>
                    </li>
                    <li className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Completed Tasks:</span> <span className="text-green-500">{completedTasks}</span>
                    </li>
                    <li className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Pending Tasks:</span> <span className="text-orange-500">{pendingTasks}</span>
                    </li>
                    <li className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Upcoming Deadlines (7 days):</span> <span className="text-destructive">{upcomingDeadlines}</span>
                    </li>
                </ul>

                {/* Close button at the bottom for better UX on mobile */}
                <div className="mt-auto pt-4 border-t border-border">
                    <Button onClick={onClose} className="w-full" variant="secondary">
                        <X className="mr-2 h-4 w-4" /> Close Sidebar
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;

import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator'; // For visual separation
import { Badge } from '@/components/ui/badge'; // For highlighting
import {
    Accordion, // For expandable feature details or FAQ
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

// Icons from lucide-react for features
import {
    ListTodo,
    CalendarDays,
    BellRing,
    BarChart2,
    Users,
    Sparkles,
    ArrowRight,
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* 🔝 Top Navbar - Consistent with Login/Register */}
            <nav className="bg-card text-card-foreground shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-primary">
                        <Link to="/">Task Tracker</Link>
                    </h1>
                    <ul className="flex space-x-6 font-medium">
                        <li>
                            <Link to="/login" className="hover:text-primary transition-colors">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="hover:text-primary transition-colors">
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* ヒーローセクション (Hero Section) */}
            <section className="relative w-full py-24 md:py-32 lg:py-40 flex items-center justify-center text-center bg-gradient-to-br from-primary/10 to-background overflow-hidden">
                {/* Background gradient/pattern for visual appeal */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 20v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 14v-4H4v4H0v2h4v4h2v-4h4v-2H6zm0 20v-4H4v4H0v2h4v4h2v-4h4v-2H6zM36 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 0v-4H4v4H0v2h4v4h2v-4h4v-2H6zM21 21v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM21 51v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM46 6v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM46 36v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' fill='%239C92AC'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="relative z-10 max-w-4xl px-4">
                    <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                        Your Ultimate Task Companion
                    </Badge>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-foreground mb-6">
                        Organize Your Academic Life with Ease
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Effortlessly manage assignments, projects, and deadlines. Stay on top of your studies and achieve your goals.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login">
                            <Button size="lg" className="px-8 py-3 text-lg">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                Sign Up Today
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full max-w-6xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Powerful Features Designed for Students
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        From simple task tracking to smart reminders, we've got everything you need to succeed.
                    </p>
                    <Separator className="my-8 w-24 mx-auto bg-primary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Card 1: Intuitive Task Management */}
                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <ListTodo className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl font-semibold mb-2">Intuitive Task Management</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Create, organize, and prioritize your academic tasks with a user-friendly interface.
                        </CardDescription>
                    </Card>

                    {/* Feature Card 2: Smart Deadline Tracking */}
                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <CalendarDays className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl font-semibold mb-2">Smart Deadline Tracking</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Never miss a submission with clear due dates and upcoming deadline alerts.
                        </CardDescription>
                    </Card>

                    {/* Feature Card 3: Customizable Reminders */}
                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <BellRing className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl font-semibold mb-2">Customizable Reminders</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Set personal reminders for tasks, exams, or study sessions to stay focused.
                        </CardDescription>
                    </Card>

                    {/* Feature Card 4: Progress Visualization */}
                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <BarChart2 className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl font-semibold mb-2">Progress Visualization</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Track your completion rates and visualize your productivity over time.
                        </CardDescription>
                    </Card>

                    {/* Feature Card 5: Collaborative Features (Placeholder) */}
                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <Users className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl font-semibold mb-2">Collaborative Features</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            (Coming Soon) Work on group projects by sharing tasks and updates with teammates.
                        </CardDescription>
                    </Card>

                    {/* Feature Card 6: Clean & Responsive Design */}
                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl font-semibold mb-2">Clean & Responsive Design</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Enjoy a seamless experience on any device, from desktop to mobile.
                        </CardDescription>
                    </Card>
                </div>
            </section>

            {/* Call to Action / FAQ Section */}
            <section className="w-full max-w-6xl mx-auto py-16 px-4 bg-card rounded-xl shadow-lg mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Join thousands of students who are already boosting their productivity.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                            <Link to="/register">
                                <Button size="lg">Create Your Account</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" size="lg">Log In</Button>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-6 text-center md:text-left">
                            Frequently Asked Questions
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Is Task Tracker free to use?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Yes, Task Tracker offers a robust free tier with all essential features for students.
                                    Premium features may be introduced in the future.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Can I access it on my phone?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Absolutely! Our application is fully responsive and works seamlessly on all devices,
                                    including smartphones and tablets.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>How do I get support?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    You can reach our support team via email at support@tasktracker.com or
                                    through our contact form after logging in.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-muted-foreground text-sm border-t border-border mt-auto">
                <p>&copy; 2025 Task Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;

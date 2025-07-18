import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

            {/* 🧾 Page Content - Centered Card */}
            <div className="pt-24 px-4 flex flex-col items-center justify-center min-h-screen-minus-navbar"> {/* Adjusted height for centering */}
                <Card className="shadow-lg rounded-xl p-8 max-w-xl text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold mb-2">Welcome to the Student Task Tracker</CardTitle>
                        <CardDescription className="text-lg">
                            This is a simple and effective application to help students manage and track their daily tasks and goals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="text-muted-foreground mb-6">
                            Organize your assignments, projects, and deadlines with ease. Get started by logging in or creating an account!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/login">
                                <Button size="lg">Get Started</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="lg">Sign Up</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Home;

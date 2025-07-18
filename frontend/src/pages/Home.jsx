import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* 🔝 Top Navbar */}
            <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600"><Link to="/">Task Tracker</Link></h1>
                    <ul className="flex space-x-6 text-blue-600 font-medium">
                        <li>
                            <Link to="/login" className="hover:underline">Login</Link>
                        </li>
                        <li>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* 🧾 Page Content */}
            <div className="pt-24 px-4 flex flex-col items-center justify-center">
                <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to the Student Task Tracker</h2>
                    <p className="text-gray-600">
                        This is a simple and effective application to help students manage and track their daily tasks and goals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
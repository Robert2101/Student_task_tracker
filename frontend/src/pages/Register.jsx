import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const { signup, isSigningUp } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.name.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm();

        if (success === true) signup(formData);
    };
    return (
        <>
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center">Create an Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span
                            className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSigningUp}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                    >
                        {isSigningUp ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
        </>
    );
};

export default Register;

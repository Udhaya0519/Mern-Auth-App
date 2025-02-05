import { motion } from "framer-motion";
import { Lock, Mail, Loader } from "lucide-react";
import Input from "../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/auth.store";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { isLoading, login, error } = useAuthStore();
 
    const handleLogin = async(e) => {
      e.preventDefault();
      await login(email, password)
    };
 
    return (
       <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 opacity-50 max-w-md w-full backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl"
       >
          <div className="p-8">
             <h2 className="bg-gradient-to-r mb-6 text-center from-green-300 to-emerald-600 text-transparent text-3xl font-bold bg-clip-text">
                Welcome Back
             </h2>
             <form onSubmit={handleLogin}>
                <Input
                   icon={Mail}
                   type="email"
                   placeholder="Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                   icon={Lock}
                   type="password"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                />
                <Link to={"/forgot-password"} className="text-sm text-green-400!">Forgot password</Link>
                {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
                <motion.button
                   className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                         font-bold rounded-lg shadow-lg hover:from-green-600
                         hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                          focus:ring-offset-gray-900 transition duration-200 cursor-pointer"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   type="submit"
                   disabled={isLoading}
                >
                   { isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto"/>: "Login"}
                </motion.button>
             </form>
          </div>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center rounded-b-2xl">
             <p className="text-sm text-gray-400">Don&apos;t have an account?<Link className="text-green-400! hover:underline! ml-2" to={"/signup"} >Sign up</Link></p>
          </div>
       </motion.div>
    );
}

export default LoginPage;
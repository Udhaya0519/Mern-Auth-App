import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import Input from "../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/auth.store";

function SignUpPage() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();
   const { signup, error, isLoading } = useAuthStore();

   const handleSignUp = async (e) => {
      e.preventDefault();
      try {
         await signup(email,password,name)
         navigate("/verify-email")
      } catch (error) {
         console.log("Error signing up:",error);
      }
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
               Create Account
            </h2>
            <form onSubmit={handleSignUp}>
               <Input
                  icon={User}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
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
               {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
               <PasswordStrengthMeter password={ password }/>
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
                  {!isLoading ? "Sign Up": <Loader className="text-gray-500 animate-spin text-2xl mx-auto" /> }
               </motion.button>
            </form>
         </div>
         <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center rounded-b-2xl">
            <p className="text-sm text-gray-400">Already have an account?<Link className="text-green-400! hover:underline! ml-2" to={"/login"} >Log in</Link></p>
         </div>
      </motion.div>
   );
}

export default SignUpPage;

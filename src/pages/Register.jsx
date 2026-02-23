import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
    >
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white p-10"
        >
          <h1 className="text-5xl font-bold mb-6">
            Join FinTrack
          </h1>
          <p className="text-slate-300 text-lg max-w-sm">
            Start building smarter financial habits today.
            Your money deserves clarity.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-white">
              Create Account
            </h2>
            <p className="text-slate-400 mt-2">
              Begin your journey to control
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="text-sm text-slate-400">
                Email
              </label>
              <input
                type="email"
                className="w-full mt-2 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Password
              </label>
              <input
                type="password"
                className="w-full mt-2 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-lg font-semibold text-white"
            >
              Create Account
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-purple-400 hover:underline"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden"
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, -60, 0], y: [0, -60, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 80, 0], y: [0, 80, -80, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white px-10"
        >
          <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FinTrack
          </h1>
          <p className="text-slate-300 text-lg max-w-sm mx-auto">
            Take control of your money.
            Track spending. Analyze trends.
            Build smarter financial habits.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-white">
              Welcome Back
            </h2>
            <p className="text-slate-400 mt-2">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm text-slate-400">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition py-3 rounded-lg font-semibold text-white shadow-lg"
            >
              Sign In
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Create one
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
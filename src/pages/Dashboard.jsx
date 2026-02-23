import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatCurrency";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // ========================
  // Summary Calculations
  // ========================
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expenses;

  // ========================
  // Date-based Calculations
  // ========================
  const now = new Date();

  const todayTotals = transactions.filter((t) => {
    if (!t.date) return false;
    const d = new Date(t.date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const weekTotals = transactions.filter((t) => {
    if (!t.date) return false;
    const d = new Date(t.date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return d >= oneWeekAgo;
  });

  const monthTotals = transactions.filter((t) => {
    if (!t.date) return false;
    const d = new Date(t.date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const calculateTotals = (list, type) =>
    list
      .filter((t) => t.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);

  const todayIncome = calculateTotals(todayTotals, "income");
  const todayExpense = calculateTotals(todayTotals, "expense");

  const weekIncome = calculateTotals(weekTotals, "income");
  const weekExpense = calculateTotals(weekTotals, "expense");

  const monthIncome = calculateTotals(monthTotals, "income");
  const monthExpense = calculateTotals(monthTotals, "expense");

  // ========================
  // Chart Data
  // ========================
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#14b8a6"];

  // ========================
  // Auth + Fetch
  // ========================
  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/");
    } else {
      setUser(currentUser);
      fetchTransactions(currentUser.uid);
    }
  }, []);

  const fetchTransactions = async (uid) => {
    const snapshot = await getDocs(
      collection(db, "users", uid, "transactions")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTransactions(data);
  };

  // ========================
  // Add Transaction
  // ========================
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!amount || !category) return;

    await addDoc(collection(db, "users", user.uid, "transactions"), {
      amount: Number(amount),
      type,
      category,
      description,
      createdAt: serverTimestamp(),
      date: new Date().toISOString(),
    });

    setAmount("");
    setCategory("");
    setDescription("");

    fetchTransactions(user.uid);
  };

  // ========================
  // Delete
  // ========================
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "transactions", id));
    fetchTransactions(user.uid);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-10"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          {user && (
            <p className="text-slate-400 mt-2">
              Welcome back, {user.email}
            </p>
          )}
        </div>

        {/* Overall Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Total Income</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {formatCurrency(income)}
            </h2>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Total Expenses</p>
            <h2 className="text-3xl font-bold text-red-400 mt-2">
              {formatCurrency(expenses)}
            </h2>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Balance</p>
            <h2 className={`text-3xl font-bold mt-2 ${
              balance >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {formatCurrency(balance)}
            </h2>
          </div>
        </div>

        {/* Date Based Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm mb-2">Today</p>
            <p className="text-green-400">
              Income: {formatCurrency(todayIncome)}
            </p>
            <p className="text-red-400">
              Expense: {formatCurrency(todayExpense)}
            </p>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm mb-2">This Week</p>
            <p className="text-green-400">
              Income: {formatCurrency(weekIncome)}
            </p>
            <p className="text-red-400">
              Expense: {formatCurrency(weekExpense)}
            </p>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm mb-2">This Month</p>
            <p className="text-green-400">
              Income: {formatCurrency(monthIncome)}
            </p>
            <p className="text-red-400">
              Expense: {formatCurrency(monthExpense)}
            </p>
          </div>

        </div>

        {/* Add Transaction */}
        <div className="bg-slate-900/60 p-6 rounded-2xl mb-10 border border-slate-800">
          <h2 className="text-xl font-semibold mb-6">Add Transaction</h2>

          <form
            onSubmit={handleAddTransaction}
            className="grid md:grid-cols-5 gap-4"
          >
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 rounded bg-slate-800 border border-slate-700"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 rounded bg-slate-800 border border-slate-700"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 rounded bg-slate-800 border border-slate-700"
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded bg-slate-800 border border-slate-700"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded p-3 font-semibold"
            >
              Add
            </button>
          </form>
        </div>

        {/* Transactions */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-6">Transactions</h2>

          <div className="space-y-4">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center bg-slate-800 p-4 rounded-xl"
              >
                <div>
                  <p className="font-medium">{t.category}</p>
                  <p className="text-sm text-slate-400">
                    {t.description}
                  </p>
                  {t.date && (
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(t.date).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <p
                    className={`font-semibold ${
                      t.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatCurrency(t.amount)}
                  </p>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
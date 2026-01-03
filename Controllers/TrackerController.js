import ExpressError from "../Middlewares/ExpressError.js";
import Tracker from "../Models/TrackerSchema.js"
export const allTxn = async (req, res) => {
  const { category } = req.query || "all"
  const userId = req?.user?._id
  console.log("category: ", category)
  const txn = await Tracker.find({user: userId});
  console.log("all txns: ", txn)
  const filter = category && category !== "all" ? { category } : {};
  const filtered = txn.filter((t) => {
    if (category === "fruits") return t.category === "fruits";
    if (category === "devices") return t.category === "devices";
    if (category === "groceries") return t.category === "groceries";
    return 0
  })
  console.log("filtered ", filtered)
  const incomeTxn = txn.filter(t => t.type === "income")
  const totalIncome = incomeTxn.reduce((sum, t) => sum + t.amount, 0)
  const expenseTxn = txn.filter(t => t.type === "expense")
  const totalExpense = expenseTxn.reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const report = txn.reduce((report, t) => {
    const monthYear = new Date(t.date).toLocaleString("default", {
      year: "numeric",
      month: "short",
    });
    if (!report[monthYear]) {
      report[monthYear] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      report[monthYear].income += t.amount;
    } else if (t.type === "expense") {
      report[monthYear].expense += t.amount;
    }
    report[monthYear].entries = report[monthYear].entries || []
    // console.log("entry: ", report[monthYear].entries)
    report[monthYear].entries.push(t);
    return report;
  }, {});
  const limit = 3;
  const skip = Math.max(txn.length - limit, 0);
  // const skip = txn.length - limit;
  const recent = await Tracker.find({user:userId,...filter}).skip(skip).limit(limit)
  // console.log("recent: ", recent)
  // console.log("totalIncome: ", totalIncome, "totalExpense: ", totalExpense)
  res.status(200).json({ totalIncome: totalIncome, totalExpense: totalExpense, totalBalance: balance, txn: txn, report, recent });
}

export const newTxn = async (req, res, next) => {
  const { title, amount, category, type } = req.body;
  const userId = req?.user?._id
  if (!title || !amount || !category) return next(new ExpressError(400, "All fields are required"));
  const txn = await Tracker.create({ title, amount, category, type, user: userId });
  res.status(201).json({ message: "Txn added successfully" });
}

export const singleTxn = async (req, res) => {
  const { id } = req.params;
  res.status(200).json({ _id: id, title: "Sample Transaction", amount: 100, category: "Food" });
}
export const editTxn = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category } = req.body;

  res.status(200).json({ _id: id, title, amount, category, message: "Transaction updated" });
}

export const deleteTxn = async (req, res) => {
  const { id } = req.params;
  const txn = await Tracker.findByIdAndDelete(id);
  res.status(200).json({ message: "Transaction deleted", txn });
}
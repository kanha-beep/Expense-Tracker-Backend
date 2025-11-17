import express from "express";
import WrapAsync from "../Middlewares/WrapAsync.js"
import { allTxn, newTxn, singleTxn, editTxn, deleteTxn } from "../Controllers/TrackerController.js";
// /api/tracker
const router = express.Router();

router.get("/", WrapAsync(allTxn));
router.post("/new", WrapAsync(newTxn))
router.get("/:id", WrapAsync(singleTxn))
router.put("/:id", WrapAsync(editTxn));
router.delete("/:id", WrapAsync(deleteTxn));

export default router;
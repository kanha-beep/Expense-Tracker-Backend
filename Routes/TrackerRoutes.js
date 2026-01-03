import express from "express";
import WrapAsync from "../Middlewares/WrapAsync.js"
import { allTxn, newTxn, singleTxn, editTxn, deleteTxn } from "../Controllers/TrackerController.js";
import VerifyAuth from "../Middlewares/VerifyAuth.js";
// /api/tracker
const router = express.Router();

router.get("/", VerifyAuth, WrapAsync(allTxn));
router.post("/new", VerifyAuth, WrapAsync(newTxn))
router.get("/:id", VerifyAuth, WrapAsync(singleTxn))
router.put("/:id", VerifyAuth, WrapAsync(editTxn));
router.delete("/:id", VerifyAuth, WrapAsync(deleteTxn));

export default router;
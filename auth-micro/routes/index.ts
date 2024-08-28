import { Router } from "express";
import UserRoutes from "./UserRoute"

const router=Router()
router.use("/api",UserRoutes)

export default router
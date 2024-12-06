import express from 'express';
import { getUserDashboardStats, getAdminDashboardStats } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';

const router = express.Router();

// User dashboard stats - requires authentication
router.get('/user-stats', authenticateToken, getUserDashboardStats);

// Admin dashboard stats - requires authentication and admin role
router.get('/admin-stats', authenticateToken, isAdmin, getAdminDashboardStats);

export default router;

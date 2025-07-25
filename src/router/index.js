import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import PublicProfileView from '../views/PublicProfileView.vue'
import axios from 'axios';

const routes = [
    { 
        path: '/', 
        name: 'Auth', 
        component: AuthView,
        meta: { guestOnly: true } // <-- NEW: Mark this route as for guests only
    },
    { 
        path: '/admin', 
        name: 'Admin', 
        component: AdminDashboardView, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/:username', 
        name: 'PublicProfile', 
        component: PublicProfileView 
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// This is the updated navigation guard
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;
    const guestOnly = to.meta.guestOnly;

    // Check the user's session status from our backend API
    let isLoggedIn = false;
    try {
        const { data } = await axios.get('/session.php');
        isLoggedIn = data.loggedIn;
    } catch (error) {
        // If API fails, assume not logged in for safety
        isLoggedIn = false;
    }

    // --- LOGIC ---

    // 1. If the route requires authentication AND the user is NOT logged in,
    //    redirect them to the login page.
    if (requiresAuth && !isLoggedIn) {
        next({ name: 'Auth' });
    } 
    // 2. NEW: If the route is for guests only AND the user IS logged in,
    //    redirect them to their admin dashboard.
    else if (guestOnly && isLoggedIn) {
        next({ name: 'Admin' });
    } 
    // 3. In all other cases, let the user proceed.
    else {
        next();
    }
});

export default router
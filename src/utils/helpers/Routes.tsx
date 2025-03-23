import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/tokenManager";

// Define RouteProps Interface
interface RouteProps {
    children: ReactNode;
}

// Private Route Component
export const PrivateRoute = ({ children }: RouteProps): JSX.Element => {
    const location = useLocation();
    console.log("PrivateRoute: Checking authentication status for path:", location.pathname);
    
    const isAuth = isAuthenticated();
    console.log(`PrivateRoute: Authentication status: ${isAuth ? 'Authenticated' : 'Not authenticated'}`);
    
    if (isAuth) {
        console.log("PrivateRoute: Token exists, rendering protected content for path:", location.pathname);
        return <>{children}</>;
    }
    
    console.log("PrivateRoute: No token, redirecting to login from path:", location.pathname);
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};

// Public Route Component
export const PublicRoute = ({ children }: RouteProps): JSX.Element => {
    const location = useLocation();
    console.log("PublicRoute: Current path:", location.pathname);
    
    // Don't redirect from landing page, index page, or auth pages
    if (location.pathname === '/' || 
        location.pathname === '/index' || 
        location.pathname.startsWith('/sign-') || 
        location.pathname.includes('password')) {
        console.log("PublicRoute: Allowing access to public page:", location.pathname);
        return <>{children}</>;
    }
    
    // If user is authenticated and trying to access a non-public page, redirect to inbox
    if (isAuthenticated()) {
        console.log("PublicRoute: User is authenticated, redirecting to inbox");
        return <Navigate to="/home/inbox/all" replace />;
    }
    
    // Otherwise allow access
    return <>{children}</>;
};


import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/authService";

// Define RouteProps Interface
interface RouteProps {
    children: ReactNode;
}

// Private Route Component
export const PrivateRoute = ({ children }: RouteProps): JSX.Element => {
    const location = useLocation();
    console.log("PrivateRoute: Checking authentication status for path:", location.pathname);
    
    const isAuth = AuthService.isAuthenticated();
    console.log(`PrivateRoute: Token exists: ${isAuth ? 'true' : 'false'} ${isAuth ? 'Token value found' : 'No token found'}`);
    
    if (isAuth) {
        console.log("PrivateRoute: Token exists, rendering protected content for path:", location.pathname);
        return <>{children}</>;
    }
    
    console.log("PrivateRoute: No token, redirecting to login from path:", location.pathname);
    return <Navigate to="/sign-in" state={{ from: location.pathname }} />;
};

// Public Route Component
export const PublicRoute = ({ children }: RouteProps): JSX.Element => {
    const location = useLocation();
    
    // Don't redirect from landing page or auth pages
    if (location.pathname === '/' || 
        location.pathname.startsWith('/sign-') || 
        location.pathname.includes('password')) {
        return <>{children}</>;
    }
    
    return AuthService.isAuthenticated() ? <Navigate to="/home/inbox/all" /> : <>{children}</>;
};

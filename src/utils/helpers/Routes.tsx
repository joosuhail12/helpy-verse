
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/tokenManager";

// Define RouteProps Interface
interface RouteProps {
    children: ReactNode;
}

// Private Route Component
export const PrivateRoute = ({ children }: RouteProps): JSX.Element => {
    console.log("ProtectedRoute: Checking authentication status");
    const isAuth = isAuthenticated();
    console.log(`ProtectedRoute: Token exists: ${isAuth ? 'true' : 'false'} ${isAuth ? 'Token value found' : 'No token found'}`);
    
    if (isAuth) {
        console.log("ProtectedRoute: Token exists, rendering protected content");
        return <>{children}</>;
    }
    
    console.log("ProtectedRoute: No token, redirecting to login");
    return <Navigate to="/sign-in" />;
};

// Public Route Component
export const PublicRoute = ({ children }: RouteProps): JSX.Element => {
    const location = useLocation();
    
    // Don't redirect from landing page
    if (location.pathname === '/') {
        return <>{children}</>;
    }
    
    return isAuthenticated() ? <Navigate to="/inbox" /> : <>{children}</>;
};

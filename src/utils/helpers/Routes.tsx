
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/tokenManager";

// 🟢 Define RouteProps Interface
interface RouteProps {
    children: ReactNode;
}

// 🟢 Private Route Component
export const PrivateRoute = ({ children }: RouteProps): JSX.Element => {
    // Check authentication using our improved isAuthenticated function
    const isUserAuthenticated = isAuthenticated();
    
    console.log("PrivateRoute: Authentication check result:", isUserAuthenticated);
    
    // If not authenticated, redirect to sign-in page
    if (!isUserAuthenticated) {
        console.log("PrivateRoute: User not authenticated, redirecting to sign-in");
        return <Navigate to="/sign-in" replace />;
    }
    
    // If authenticated, render the protected content
    console.log("PrivateRoute: User is authenticated, rendering protected content");
    return <>{children}</>;
};

// 🟢 Public Route Component
export const PublicRoute = ({ children }: RouteProps): JSX.Element => {
    // Check if user is already authenticated
    const isUserAuthenticated = isAuthenticated();
    
    console.log("PublicRoute: Authentication check result:", isUserAuthenticated);
    
    // If already authenticated, redirect to home page
    if (isUserAuthenticated) {
        console.log("PublicRoute: User is already authenticated, redirecting to home");
        return <Navigate to="/home" replace />;
    }
    
    // If not authenticated, render the public content
    return <>{children}</>;
};

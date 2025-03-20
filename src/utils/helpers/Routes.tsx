
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/tokenManager";

// Define RouteProps Interface
interface RouteProps {
    children: ReactNode;
}

// Private Route Component
export const PrivateRoute = ({ children }: RouteProps): JSX.Element => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/sign-in" />;
};

// Public Route Component
export const PublicRoute = ({ children }: RouteProps): JSX.Element => {
    return isAuthenticated() ? <Navigate to="/inbox" /> : <>{children}</>;
};

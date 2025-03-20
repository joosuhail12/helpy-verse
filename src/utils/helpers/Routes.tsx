import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "./helpers";
// 🟢 Define RouteProps Interface
interface RouteProps {
    children: ReactNode;
}

// 🟢 Private Route Component
export const PrivateRoute = ({ children }: RouteProps): JSX.Element => {
    return getCookie("customerToken") ? <>{children}</> : <Navigate to="/" />;
};

// 🟢 Public Route Component
export const PublicRoute = ({ children }: RouteProps): JSX.Element => {
    return getCookie("customerToken") ? <Navigate to="/inbox" /> : <>{children}</>;
};

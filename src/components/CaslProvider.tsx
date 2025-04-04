
import React, { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchUserProfile, fetchWorkspaceData, getUserPermission } from "@/store/slices/authSlice";

interface CaslProviderProps {
    children: React.ReactNode;
}

const CaslProvider: React.FC<CaslProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);
    const isAuthenticated = auth?.isAuthenticated || false;

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUserProfile()); 
            dispatch(fetchWorkspaceData(auth?.user?.workspace?.id || '')); // Pass workspace ID or empty string
            dispatch(getUserPermission()); // Remove empty object parameter
        }
    }, [dispatch, isAuthenticated, auth?.user?.workspace?.id]);

    return <>{children}</>;
};

export default CaslProvider;

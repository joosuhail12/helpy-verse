
import React, { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchUserProfile, fetchWorkspaceData } from "@/store/slices/auth/userActions";
import { getUserPermission } from "@/store/slices/auth/authSlice";
import { useAuthContext } from "@/hooks/useAuthContext";

interface CaslProviderProps {
    children: React.ReactNode;
}

const CaslProvider: React.FC<CaslProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUserProfile()); 
            dispatch(fetchWorkspaceData());
            dispatch(getUserPermission()); 
        }
    }, [dispatch, isAuthenticated]);

    return <>{children}</>;
};

export default CaslProvider;

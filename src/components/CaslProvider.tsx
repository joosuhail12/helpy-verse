
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
            dispatch(fetchWorkspaceData());
            dispatch(getUserPermission()); 
        }
    }, [dispatch, isAuthenticated]);

    return <>{children}</>;
};

export default CaslProvider;

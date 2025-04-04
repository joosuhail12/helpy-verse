
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchUserProfile } from "@/store/slices/user/userSlice";
// Import directly from the action creators
import { fetchWorkspaceData } from "@/store/slices/auth/userActions";
import { getUserPermission } from "@/store/slices/auth/permissionActions";

interface CaslProviderProps {
    children: React.ReactNode;
}

// Create a selector that only gets needed slice of state
const selectAuthStatus = (state: any) => state.auth.isAuthenticated;

const CaslProvider: React.FC<CaslProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectAuthStatus);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        // Only fetch data once when authenticated
        if (isAuthenticated && !dataFetched) {
            console.log("CaslProvider: Fetching user data and permissions");
            
            // Create an array of promises for the async operations
            const promises = [
                dispatch(fetchUserProfile()),
            ];
            
            // Only add these if they exist and are functions
            if (typeof fetchWorkspaceData === 'function') {
                promises.push(dispatch(fetchWorkspaceData()));
            }
            
            if (typeof getUserPermission === 'function') {
                promises.push(dispatch(getUserPermission()));
            }
            
            Promise.all(promises)
                .then(() => {
                    setDataFetched(true);
                    console.log("CaslProvider: Successfully fetched user data");
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                    setDataFetched(true); // Still mark as fetched to prevent endless retries
                });
        }
    }, [dispatch, isAuthenticated, dataFetched]);

    return <>{children}</>;
};

export default CaslProvider;


import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchUserProfile } from "@/store/slices/user/userSlice";
// Import directly from the action creators
import { fetchWorkspaceDataThunk } from "@/store/slices/auth/userActions";
import { getUserPermissionThunk } from "@/store/slices/auth/permissionActions";
import { toast } from "@/components/ui/use-toast";

interface CaslProviderProps {
    children: React.ReactNode;
}

// Create a selector that only gets needed slice of state
const selectAuthStatus = (state: any) => state.auth.isAuthenticated;

const CaslProvider: React.FC<CaslProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectAuthStatus);
    const [dataFetched, setDataFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Only fetch data once when authenticated
        if (isAuthenticated && !dataFetched && !isLoading) {
            console.log("CaslProvider: Fetching user data and permissions");
            setIsLoading(true);
            
            // Create an array of promises for the async operations
            const fetchPromises = [];
            
            // Add fetchUserProfile
            fetchPromises.push(dispatch(fetchUserProfile()).catch(error => {
                console.error("Error fetching user profile:", error);
                return null; // Return null instead of rejecting the promise
            }));
            
            // Use thunks that return PayloadAction types
            if (typeof fetchWorkspaceDataThunk === 'function') {
                fetchPromises.push(dispatch(fetchWorkspaceDataThunk()).catch(error => {
                    console.error("Error fetching workspace data:", error);
                    return null;
                }));
            }
            
            if (typeof getUserPermissionThunk === 'function') {
                fetchPromises.push(dispatch(getUserPermissionThunk()).catch(error => {
                    console.error("Error fetching user permissions:", error);
                    return null;
                }));
            }
            
            Promise.all(fetchPromises)
                .then(() => {
                    setDataFetched(true);
                    setIsLoading(false);
                    console.log("CaslProvider: Successfully fetched user data");
                })
                .catch(error => {
                    console.error("Error in CaslProvider data fetching:", error);
                    setDataFetched(true); // Still mark as fetched to prevent endless retries
                    setIsLoading(false);
                    
                    toast({
                        title: "Data Loading Error",
                        description: "Some user data could not be loaded. Some features may be limited.",
                        variant: "destructive",
                    });
                });
        }
    }, [dispatch, isAuthenticated, dataFetched, isLoading]);

    return <>{children}</>;
};

export default CaslProvider;

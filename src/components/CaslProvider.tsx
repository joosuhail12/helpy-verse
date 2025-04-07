
import * as React from "react";
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
    const [dataFetched, setDataFetched] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        // Only fetch data once when authenticated
        if (isAuthenticated && !dataFetched && !isLoading) {
            console.log("CaslProvider: Fetching user data and permissions");
            setIsLoading(true);
            
            const fetchAllData = async () => {
                try {
                    await dispatch(fetchUserProfile()).unwrap();
                    console.log("User profile fetched successfully");
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Continue with other requests even if this one fails
                }
                
                try {
                    if (typeof fetchWorkspaceDataThunk === 'function') {
                        await dispatch(fetchWorkspaceDataThunk()).unwrap();
                        console.log("Workspace data fetched successfully");
                    }
                } catch (error) {
                    console.error("Error fetching workspace data:", error);
                }
                
                try {
                    if (typeof getUserPermissionThunk === 'function') {
                        await dispatch(getUserPermissionThunk()).unwrap();
                        console.log("User permissions fetched successfully");
                    }
                } catch (error) {
                    console.error("Error fetching user permissions:", error);
                }
                
                // Mark as fetched regardless of errors to prevent endless retries
                setDataFetched(true);
                setIsLoading(false);
                console.log("CaslProvider: Data fetching complete");
            };
            
            fetchAllData().catch(error => {
                console.error("Error in CaslProvider data fetching:", error);
                setDataFetched(true);
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

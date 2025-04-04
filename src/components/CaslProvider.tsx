
import * as React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
// Fix imports to use action creators directly from their files
import { fetchUserProfile, fetchWorkspaceData } from "@/store/slices/auth/userActions";
import { getUserPermission } from "@/store/slices/auth/permissionActions";

interface CaslProviderProps {
    children: React.ReactNode;
}

// Create a selector that only gets needed slice of state
const selectAuthStatus = (state: any) => state.auth.isAuthenticated;

const CaslProvider: React.FC<CaslProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectAuthStatus);
    const [dataFetched, setDataFetched] = React.useState(false);

    React.useEffect(() => {
        // Only fetch data once when authenticated
        if (isAuthenticated && !dataFetched) {
            console.log("CaslProvider: Fetching user data and permissions");
            
            Promise.all([
                dispatch(fetchUserProfile()),
                dispatch(fetchWorkspaceData()),
                dispatch(getUserPermission())
            ])
            .then(() => {
                setDataFetched(true);
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

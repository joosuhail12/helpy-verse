
import { LogOut, Settings, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { logoutUser } from "@/store/slices/authSlice";
import { useToast } from "../ui/use-toast";

const UserProfileCard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  
  // Extract user info from the auth state
  const userEmail = user?.email || 'user@example.com'; // Fallback for development
  const userInitials = getUserInitials(userEmail);
  const userRole = user?.role || 'User';

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between w-full px-3 py-2 transition-colors duration-200 hover:bg-gray-100 rounded-md">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={userEmail} />
            <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{userEmail}</p>
            <p className="text-xs text-gray-500 truncate max-w-[120px]">{userRole}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getUserInitials(email: string): string {
  if (!email) return '?';
  
  // Use the first letter of the email or two letters if available
  const parts = email.split('@')[0].split(/[._-]/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

export default UserProfileCard;

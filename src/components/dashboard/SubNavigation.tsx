
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SubNavItem } from "./types/navigation";

interface SubNavigationProps {
  items: SubNavItem[];
  isCollapsed: boolean;
  onToggle: () => void;
}

const SubNavigation = ({ items, isCollapsed, onToggle }: SubNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Find the active item based on the current path
  const getActiveItem = (pathname: string): string | null => {
    // Check for exact matches first
    const exactMatch = items.find((item) => item.path === pathname);
    if (exactMatch) return exactMatch.path;

    // Then check for sub-paths
    const matchingItem = items.find((item) => 
      pathname.startsWith(item.path || '') && item.path !== '/'
    );
    return matchingItem?.path || null;
  };

  const activeItemPath = getActiveItem(location.pathname);

  const handleClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const variants = {
    expanded: { width: 240 },
    collapsed: { width: 56 },
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-gray-50 border-r"
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={variants}
      transition={{ duration: 0.2 }}
    >
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="self-end my-2 mr-2"
        onClick={onToggle}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <ScrollArea className="flex-grow">
        <nav className="px-2 py-2">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.path}>
                {isCollapsed ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeItemPath === item.path ? "secondary" : "ghost"}
                          size="icon"
                          className="w-full h-9 justify-start"
                          onClick={() => handleClick(item.path)}
                          onMouseEnter={() => setHoveredItem(item.path || null)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {item.icon && (
                            <item.icon className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    variant={activeItemPath === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleClick(item.path)}
                    onMouseEnter={() => setHoveredItem(item.path || null)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.icon && (
                      <item.icon className="mr-2 h-4 w-4" />
                    )}
                    <span>{item.title}</span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </motion.div>
  );
};

export default SubNavigation;

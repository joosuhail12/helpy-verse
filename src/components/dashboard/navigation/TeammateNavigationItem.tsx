import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavigationItem as NavItemType } from '../types/navigation';
import { useTeammates } from '@/contexts/TeammatesContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeammateNavigationItemProps {
    item: NavItemType;
    isSecondPanelCollapsed: boolean;
    expandedItems: string[];
    toggleExpanded: (itemTitle: string) => void;
    hasActiveChild?: (children: NavItemType[]) => boolean;
    isItemActive: (path: string) => boolean;
    navigate: (path: string) => void;
    filterMenuItems: (items: NavItemType[]) => NavItemType[];
}

// Helper to generate initials from name
const getInitials = (name: string): string => {
    if (!name) return '';
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Helper to generate a color based on the name
const getAvatarColor = (name: string): string => {
    const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500',
        'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
        'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
    ];

    // Simple hash of the name to pick a consistent color
    const hash = name.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
};

const TeammateNavigationItem = ({
    item,
    isSecondPanelCollapsed,
    expandedItems,
    toggleExpanded,
    hasActiveChild,
    isItemActive,
    navigate,
    filterMenuItems,
}: TeammateNavigationItemProps) => {
    const { teammates, loading, error, fetchTeammates, hasLoaded } = useTeammates();

    // Fetch teammates when the dropdown is expanded
    useEffect(() => {
        if (expandedItems.includes(item.title) && !hasLoaded && !loading) {
            fetchTeammates();
        }
    }, [expandedItems, item.title, fetchTeammates, hasLoaded, loading]);

    // Create dynamic children based on teammates data
    const dynamicChildren = React.useMemo(() => {
        if (!item.children) return [];

        // Start with the static children if any
        let children = [...item.children];

        // Add teammates from the API
        if (teammates && teammates.length > 0) {
            const teammateItems = teammates.map(teammate => ({
                title: teammate.name,
                path: `/home/inbox/teammates/${teammate.id}`,
                email: teammate.email,
                teammateId: teammate.id
            }));
            children = [...children, ...teammateItems];
        }

        return children;
    }, [item.children, teammates]);

    return (
        <div>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`w-full flex items-center rounded-lg transition-all duration-300 group ${isSecondPanelCollapsed ? 'justify-center p-2' : 'justify-between px-4 py-2'
                                } ${hasActiveChild?.(dynamicChildren)
                                    ? 'bg-primary/5 text-primary shadow-sm hover:shadow-md'
                                    : 'hover:bg-primary/5'}`}
                            onClick={() => toggleExpanded(item.title)}
                        >
                            <div className={`flex items-center ${isSecondPanelCollapsed ? 'justify-center' : 'gap-3'}`}>
                                {item.icon && (
                                    <div className="flex items-center justify-center w-5">
                                        <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                )}
                                {!isSecondPanelCollapsed && (
                                    <span className="font-medium transition-colors group-hover:text-primary">
                                        {item.title}
                                    </span>
                                )}
                            </div>
                            {!isSecondPanelCollapsed && (
                                <ChevronRight className={`h-4 w-4 transition-all duration-300 ${expandedItems.includes(item.title) ? 'rotate-90' : ''
                                    } group-hover:text-primary`} />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        className="z-[60] bg-white shadow-lg"
                        sideOffset={12}
                    >
                        <p>{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                            Click to {expandedItems.includes(item.title) ? 'collapse' : 'expand'}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {expandedItems.includes(item.title) && !isSecondPanelCollapsed && (
                <div className="ml-8 mt-1 space-y-1 animate-accordion-down">
                    {loading ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">Loading teammates...</div>
                    ) : error ? (
                        <div className="px-4 py-2 text-sm text-red-500">Error loading teammates</div>
                    ) : dynamicChildren.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">No teammates found</div>
                    ) : (
                        filterMenuItems(dynamicChildren).map((child: any) => (
                            <TooltipProvider key={child.teammateId || child.title} delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={`w-full flex items-center justify-start text-sm px-4 py-2 rounded-lg transition-all duration-300 group
                        ${isItemActive(child.path)
                                                    ? 'bg-primary/5 text-primary shadow-sm hover:shadow-md'
                                                    : 'hover:bg-primary/5'}`}
                                            onClick={() => navigate(child.path)}
                                        >
                                            {child.teammateId && (
                                                <Avatar className="h-6 w-6 mr-2">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(child.title)}`} />
                                                    <AvatarFallback className={getAvatarColor(child.title)}>
                                                        {getInitials(child.title)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <span className="transition-colors group-hover:text-primary truncate">
                                                {child.title}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="z-[60] bg-white shadow-lg"
                                        sideOffset={12}
                                    >
                                        <p>{child.title}</p>
                                        {child.email && <p className="text-xs text-muted-foreground">{child.email}</p>}
                                        <p className="text-xs text-muted-foreground">Click to view tickets</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TeammateNavigationItem; 
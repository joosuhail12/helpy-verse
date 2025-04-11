import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMentions } from '@/store/slices/mentionsSlice';
import { RootState } from '@/store/store';
import { Mention } from '@/api/services/mentionsService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUserInitials } from '@/utils/userUtils';

export interface MentionSuggestionItem {
    label: string;
    value: string;
    id?: string;
    avatar?: string;
}

interface MentionsSuggestionProps {
    items: MentionSuggestionItem[];
    command: (item: MentionSuggestionItem) => void;
}

const MentionsSuggestion: React.FC<MentionsSuggestionProps> = ({ items, command }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dispatch = useDispatch();
    const { mentions, loading } = useSelector((state: RootState) => state.mentions);

    // Fetch mentions when component mounts
    useEffect(() => {
        dispatch(fetchMentions());
    }, [dispatch]);

    const selectItem = (index: number) => {
        setSelectedIndex(index);
        command(items[index]);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex((selectedIndex + items.length - 1) % items.length);
            return true;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex((selectedIndex + 1) % items.length);
            return true;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            selectItem(selectedIndex);
            return true;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            return true;
        }

        return false;
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div
            className="bg-white shadow-lg rounded-lg p-2 space-y-1 max-h-60 overflow-y-auto"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {items.map((item, index) => (
                <button
                    key={item.id || item.value}
                    className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 ${index === selectedIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        }`}
                    onClick={() => selectItem(index)}
                >
                    {item.avatar ? (
                        <Avatar className="h-6 w-6">
                            <img src={item.avatar} alt={item.label} />
                            <AvatarFallback>{getUserInitials(item.label)}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>{getUserInitials(item.label)}</AvatarFallback>
                        </Avatar>
                    )}
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default MentionsSuggestion; 
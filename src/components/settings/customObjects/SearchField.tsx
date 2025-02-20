
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFieldProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchField = ({ value, onChange }: SearchFieldProps) => {
    return (
        <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
                type="text"
                placeholder="Search fields..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-8"
            />
        </div>
    );
};

export default SearchField;

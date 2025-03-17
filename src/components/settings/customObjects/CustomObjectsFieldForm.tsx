
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CustomObjectField } from "@/types/customObject";

interface FieldDetailsFormProps {
    name: string;
    type: CustomObjectField;
    required: boolean;
    description: string;
    onNameChange: (value: string) => void;
    onTypeChange: (value: CustomObjectField) => void;
    onRequiredChange: (value: boolean) => void;
    onDescriptionChange: (value: string) => void;
}

const CustomObjectFieldDetailsForm = ({
    name,
    type,
    required,
    description,
    onNameChange,
    onTypeChange,
    onRequiredChange,
    onDescriptionChange,
}: FieldDetailsFormProps) => {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Field Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="type">Field Type</Label>
                <Select value={type.toString()} onValueChange={(value) => onTypeChange(value as unknown as CustomObjectField)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="multi-select">Multi Select</SelectItem>
                        <SelectItem value="rich-text">Rich Text</SelectItem>
                        <SelectItem value="file">File Attachment</SelectItem>
                        <SelectItem value="currency">Currency</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="required">Required Field</Label>
                <Switch
                    id="required"
                    checked={required}
                    onCheckedChange={onRequiredChange}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    rows={3}
                />
            </div>
        </div>
    );
};

export default CustomObjectFieldDetailsForm;


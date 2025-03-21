
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useCustomDataMutations } from "@/hooks/useCustomDataMutations";
import { CustomObjectField, CustomFieldType, ValidationRule, FieldDependency, FieldHistoryEntry } from "@/types/customObject";
import CustomObjectFieldDetailsForm from './CustomObjectsFieldForm';
import CustomObjectFieldOptionsSection from './CustomObjectsFieldDetailsSection';
import { validateFieldName, getDefaultValidationRules } from './utils/customObjectFieldValidation';
import { customObjectService } from "@/api/services/customObject.service";

interface AddCustomObjectFieldDialogProps {
    customObjectId: string;
    isOpen: boolean;
    onClose: () => void;
    existingFields: CustomObjectField[];
}

const AddCustomObjectFieldDialog = ({ isOpen, onClose, existingFields, customObjectId }: AddCustomObjectFieldDialogProps) => {
    const [name, setName] = useState("");
    const [fieldType, setFieldType] = useState<string>("text");
    const [isRequired, setIsRequired] = useState(false);
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleTypeChange = (newType: string) => {
        setFieldType(newType);
        if (!['select', 'multi-select'].includes(newType)) {
            setOptions([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameValidationErrors = validateFieldName(name, existingFields);
        if (nameValidationErrors.length > 0) {
            toast({
                title: "Validation Error",
                description: (
                    <ul className="list-disc pl-4">
                        {nameValidationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                ),
                variant: "destructive",
            });
            return;
        }

        if (['select', 'multi-select'].includes(fieldType) && options.length === 0) {
            toast({
                title: "Validation Error",
                description: "Please add at least one option for select/multi-select fields.",
                variant: "destructive",
            });
            return;
        }

        if (['select', 'multi-select'].includes(fieldType)) {
            const duplicateOptions = options.filter((option, index) =>
                options.indexOf(option) !== index
            );
            if (duplicateOptions.length > 0) {
                toast({
                    title: "Validation Error",
                    description: "Duplicate options are not allowed.",
                    variant: "destructive",
                });
                return;
            }
        }

        try {
            setIsLoading(true);
            // Make api call here
            const response = await customObjectService.createCustomObjectField(customObjectId, {
                name,
                fieldType,
                isRequired,
                description,
                defaultValue: "",
                placeholder: "",
                options: ['select', 'multi-select'].includes(fieldType) ? options : undefined,
            });

            toast({
                title: "Success",
                description: "Custom field has been added successfully.",
            });

            onClose();
            setName("");
            setFieldType("text");
            setIsRequired(false);
            setDescription("");
            setOptions([]);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add custom field. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const showOptionsSection = ['select', 'multi-select'].includes(fieldType);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Custom Field</DialogTitle>
                        <DialogDescription>
                            Add a new custom field to the table.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <CustomObjectFieldDetailsForm
                            name={name}
                            type={fieldType}
                            required={isRequired}
                            description={description}
                            onNameChange={setName}
                            onTypeChange={handleTypeChange}
                            onRequiredChange={setIsRequired}
                            onDescriptionChange={setDescription}
                        />

                        {showOptionsSection && (
                            <CustomObjectFieldOptionsSection
                                options={options}
                                onOptionsChange={setOptions}
                            />
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Field"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCustomObjectFieldDialog;

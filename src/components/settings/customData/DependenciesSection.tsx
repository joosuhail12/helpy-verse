
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomField, FieldDependency } from "@/types/customField";
import { Plus, X } from "lucide-react";

interface DependenciesSectionProps {
  dependencies: FieldDependency[];
  onDependenciesChange: (dependencies: FieldDependency[]) => void;
  availableFields: CustomField[];
}

const DependenciesSection = ({
  dependencies,
  onDependenciesChange,
  availableFields,
}: DependenciesSectionProps) => {
  const addDependency = () => {
    onDependenciesChange([
      ...dependencies,
      {
        fieldId: availableFields[0]?.id || "",
        operator: "equals",
        value: "",
      },
    ]);
  };

  const removeDependency = (index: number) => {
    const newDependencies = [...dependencies];
    newDependencies.splice(index, 1);
    onDependenciesChange(newDependencies);
  };

  const updateDependency = (
    index: number,
    field: keyof FieldDependency,
    value: string
  ) => {
    const newDependencies = [...dependencies];
    newDependencies[index] = { ...newDependencies[index], [field]: value };
    onDependenciesChange(newDependencies);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Field Dependencies</Label>
        <Button type="button" variant="outline" size="sm" onClick={addDependency}>
          <Plus className="w-4 h-4 mr-1" />
          Add Dependency
        </Button>
      </div>
      <div className="space-y-4">
        {dependencies.map((dependency, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Select
              value={dependency.fieldId}
              onValueChange={(value) => updateDependency(index, "fieldId", value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={dependency.operator}
              onValueChange={(value) =>
                updateDependency(
                  index,
                  "operator",
                  value as FieldDependency["operator"]
                )
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="notEquals">Not Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="notContains">Not Contains</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Value"
              value={dependency.value.toString()}
              onChange={(e) => updateDependency(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeDependency(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DependenciesSection;

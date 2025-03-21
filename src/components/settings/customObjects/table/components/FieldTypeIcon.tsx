
import { Mail, Phone, CalendarDays, Link2, DollarSign, Text, ToggleLeft, FileText, ListFilter, Files } from "lucide-react";
import { CustomObjectField } from "@/types/customObject";

export const getFieldTypeIcon = (type: CustomObjectField['fieldType']) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4 text-purple-500" />;
    case 'phone':
      return <Phone className="h-4 w-4 text-indigo-500" />;
    case 'date':
      return <CalendarDays className="h-4 w-4 text-blue-500" />;
    case 'url':
      return <Link2 className="h-4 w-4 text-cyan-500" />;
    case 'currency':
      return <DollarSign className="h-4 w-4 text-emerald-500" />;
    case 'text':
      return <Text className="h-4 w-4 text-teal-500" />;
    case 'boolean':
      return <ToggleLeft className="h-4 w-4 text-green-500" />;
    case 'rich-text':
      return <FileText className="h-4 w-4 text-lime-500" />;
    case 'select':
      return <ListFilter className="h-4 w-4 text-yellow-500" />;
    case 'multi-select':
      return <Files className="h-4 w-4 text-amber-500" />;
    default:
      return <Text className="h-4 w-4 text-slate-500" />;
  }
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FileUpload from '../FileUpload';

interface AttachmentButtonProps {
  disabled?: boolean;
  isAttachmentSheetOpen: boolean;
  setIsAttachmentSheetOpen: (value: boolean) => void;
  onFilesAdded: (files: File[]) => void;
  uploadProgress: Record<string, number>;
  onRemoveFile: (file: File) => void;
  files: File[];
}

const AttachmentButton = ({
  disabled = false,
  isAttachmentSheetOpen,
  setIsAttachmentSheetOpen,
  onFilesAdded,
  uploadProgress,
  onRemoveFile,
  files,
}: AttachmentButtonProps) => {
  return (
    <Sheet open={isAttachmentSheetOpen} onOpenChange={setIsAttachmentSheetOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Files</p>
        </TooltipContent>
      </Tooltip>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add Attachments</SheetTitle>
          <SheetDescription>
            Drag and drop files or click to select files to upload
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <FileUpload
            onFilesAdded={onFilesAdded}
            uploadProgress={uploadProgress}
            onRemoveFile={onRemoveFile}
            files={files}
            disabled={disabled}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AttachmentButton;

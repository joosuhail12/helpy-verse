
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, X } from 'lucide-react';

interface TeammateHeaderProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onStartEditing: () => void;
}

const TeammateHeader = ({
  isEditing,
  onSave,
  onCancel,
  onStartEditing
}: TeammateHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link to="/home/settings/teammates">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teammates
        </Button>
      </Link>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={onStartEditing}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeammateHeader;

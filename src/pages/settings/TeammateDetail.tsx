
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Teammate } from '@/types/teammate';
import TeammateHeader from './teammates/components/TeammateHeader';
import TeammateProfileCard from './teammates/components/TeammateProfileCard';

const TeammateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammate = useAppSelector(state => 
    state.teammates.teammates.find(t => t.id === id)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedTeammate, setEditedTeammate] = useState<Teammate | null>(teammate || null);

  if (!teammate || !editedTeammate) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Teammate not found</p>
      </div>
    );
  }

  const handleSave = () => {
    toast({
      description: "Changes saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTeammate(teammate);
    setIsEditing(false);
  };

  const handleUpdateTeammate = (updates: Partial<Teammate>) => {
    setEditedTeammate(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <TeammateHeader
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        onStartEditing={() => setIsEditing(true)}
      />

      <div className="grid gap-6">
        <TeammateProfileCard
          teammate={editedTeammate}
          isEditing={isEditing}
          onUpdateTeammate={handleUpdateTeammate}
        />
      </div>
    </div>
  );
};

export default TeammateDetail;

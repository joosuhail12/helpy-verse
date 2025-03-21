
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

interface TeamEditHeaderProps {
  teamName: string;
  teamId: string;
}

const TeamEditHeader = ({ teamName, teamId }: TeamEditHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/home/settings/teams/${teamId}`)}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Pencil className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900">Edit Team: {teamName}</h1>
        </div>
      </div>
    </div>
  );
};

export default TeamEditHeader;

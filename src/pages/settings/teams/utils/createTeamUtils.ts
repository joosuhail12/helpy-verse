
import { toast } from "@/hooks/use-toast";

export const createTeam = async (teamData: any) => {
  try {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      throw new Error('Failed to create team');
    }

    return true;
  } catch (error) {
    throw error;
  }
};


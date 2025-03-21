
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from "@/hooks/use-toast";
import { resendInvitation } from '@/store/slices/teammates/actions';
import type { Teammate } from '@/types/teammate';

/**
 * Hook for teammate-related actions like resending invitations and updating
 */
export const useTeammateActions = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleResendInvitation = async (teammateId: string) => {
    try {
      await dispatch(resendInvitation(teammateId)).unwrap();
      toast({
        title: "Success",
        description: "Invitation email has been resent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTeammate = async (teammateId: string, updates: Partial<Teammate>) => {
    try {
      toast({
        title: "Success",
        description: "Teammate information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update teammate information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleResendInvitation,
    handleUpdateTeammate
  };
};

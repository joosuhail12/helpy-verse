
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Teammate, ActivityLog, TeamAssignment, TeammateSession } from '@/types/teammate';
import { mockTeammates, mockActivityLogs, mockAssignments } from './mockData';

// Fetch teammates
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTeammates;
  }
);

// Add a new teammate
export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (teammate: Partial<Teammate>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTeammate: Teammate = {
      id: `teammate-${Math.random().toString(36).substring(2, 9)}`,
      name: teammate.name || 'New Teammate',
      email: teammate.email || 'email@example.com',
      role: teammate.role || 'agent',
      status: teammate.status || 'pending',
      permissions: teammate.permissions || ['view_reports'],
      teams: teammate.teams || [],
      createdAt: new Date().toISOString(),
      avatar: teammate.avatar
    };
    return newTeammate;
  }
);

// Update a teammate
export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Teammate) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return teammate;
  }
);

// Resend invitation
export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return teammateId;
  }
);

// Fetch teammate assignments
export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchTeammateAssignments',
  async (teammateId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAssignments.filter(assignment => assignment.teammateId === teammateId);
  }
);

// Fetch teammate sessions
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        device: 'Desktop',
        browser: 'Chrome',
        ip: '192.168.1.1',
        location: 'New York, USA',
        lastActive: new Date().toISOString(),
        current: true
      },
      {
        id: '2',
        device: 'Mobile',
        browser: 'Safari',
        ip: '192.168.1.2',
        location: 'San Francisco, USA',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        current: false
      }
    ];
  }
);

// Terminate session
export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string; sessionId: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { teammateId, sessionId };
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async ({ teammateId, newPassword }: { teammateId: string; newPassword: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return teammateId;
  }
);

// Enable 2FA
export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      teammateId,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAFKUlEQVRo3uyaz48cRRDHv1Xd0zuzM7vemV07XiCRbEsIJF/4ceCIhBKUAyIXDkhI3HLihMSNfy9SFKRENhAQBEHIiW/szOzszOxO9/QUSVdXveaQHFl+jte73z7s+HR3dVV1VzUMH59vVR+fT1A/qxrUBTx9am5ubj4FaJ7+1ABzsyxrs7Zt26zr2rrO89X79epu+KysgAgRIrS2XdNijDFG1HVtaOi6nzXATxBBREQUIgwRRAghxBhjjAEREdGeAPxhXYAQLcYYUYgQIxEhhBBjJEL0oP9mEEA/qwtQYdM0OWIXEdusW4wYvXdFUVxcXGCMRWQPAMJaVcAYY17PzKqqsohmszM8P8eYc8zz/Pz8HGPYTgBZmQN2VjVVVZVlWZbFbDa9uroqipxy/nN5Cf3TXQCGqyQXAIsmU4CyLMuyLJezYnl6ihBizuXZ2RlGCCHsBTC0pizqumkAGQqAqqqqspjNy9PTE4jlcrFYLKHrAJ0DOgcAGJRPb5q6aRrKJX8BsKiqqihxOlWA+Xx+fHx8dHQEXZcjdg6YmZSjaRqc5YxEdXVVlSXNZrOTk5PZbDabz+fzuQ42BhTnMQQQwsaxaZqmaRrKxQGOj2az6XQ6nU6mUwWAHGE7ALScsizbNm/atvVZ/+LPR0SIWTGfz2aT6VQBJpPJZDKZTCZQFI1DZoBplU+raHvgMcaYtz1gURRlWU4mYwWYjscKoCgK0LkDQJgE29a2bZ+zbTFC03SGvGU5LssJGmA8Ho/H4/FYAYbDoQJAUXQO0Ajf2t53naPrOsyRspwpQFmMxiMFGA2Hw+FwOFQANQIHDCZlYRjbpumJ8z7nnPdcliUaYDQajYbD0Ug1AEXh+UBVkJV0pnNu4Ni2eZ5T17VdPu/3AMPhaDgaKIAa4XA4GAwGCpCKoDUClCRNnee5cZxPJuNxOVaAwWA4GAwGAyUdDAbqgQKAziVEsKoEaBiRbcsxnxZlOVGAwWCoAP3+YNDv9/t9BYA+AH1zQCpCEZEdMi52s+l0WpbjwaCvAP1+vwcA2tvbPQXo9/ugc4lB6wsQglj+GEJIJEXRc4Her3u9XvjvYLu7HdA5wMoQAIBJBAB0LgzA990H1MARYohdR5Qjbgcg+QCdI9E5AkUQRAoApP2zzpHkDtgOIILWFyDRuQ44R+k6jUBCVNwJIFYU3AAIO58AxIl+M0QRUYRuBxBdOSciBZDkHIiIcxQ2QBGR7QAkkXUgRF/3CDsAAHbQb4AwABfYgZzv3QLgegAioJsA0I+AngNwU4wLAJgOwI0AABMdJxkA+m0AXI48AMYCPSDdCCS65ACTSgADcPccYDsCuDUHdgJoPkAiugEQNgO4tQZuB0jw/wIQBQyA2AwA9wA3AWKxGSDdCfBrEmBzjuMmgN28GJ24EWJEbgP0c8Cdid5cA/EOiGEDBLEdgNgMIH4zANsYwQboN0B9HTgNMIlCt9nGGO5A9P41wGbXpkNi1wDTtWw9ADYB3HQIeQLMdEyZDnENQIitAe5eCEJrALgHuDUHrBDSk7jpJg20TbdouLZCuGm1hmuLhJuWatgMsLnp2JeC+doXw5YvBi5fDF+/GLh8Mbz1wwIIbgf478tB05eDqS+XE8tl35dD4RvW6w2Ldt+wXm9YsnsQ89YAHrn28Gjsw6OxD1+e4sGXp8Y/fHxoL7/e9vHl2xebBZu3f3j794fP30jCPyY+fr+D9w+/f/R9Hd7P/R+3jzUZYCEWEAAAAABJRU5ErkJggg==',
      secretKey: 'ABCDEFGHIJKLMNOP'
    };
  }
);

// Verify 2FA
export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, code }: { teammateId: string; code: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { teammateId, verified: true };
  }
);

// Disable 2FA
export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return teammateId;
  }
);

// Update teammates role (bulk action)
export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { teammateIds, role };
  }
);

// Export teammates
export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (format: 'csv' | 'json') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, format };
  }
);

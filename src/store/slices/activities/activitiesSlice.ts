
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '@/types/activity';

interface ActivitiesState {
  contactActivities: Record<string, Activity[]>;
  companyActivities: Record<string, Activity[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  contactActivities: {},
  companyActivities: {},
  loading: false,
  error: null
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setContactActivities: (state, action: PayloadAction<{ contactId: string, activities: Activity[] }>) => {
      const { contactId, activities } = action.payload;
      state.contactActivities[contactId] = activities;
    },
    addContactActivity: (state, action: PayloadAction<{ contactId: string, activity: Activity }>) => {
      const { contactId, activity } = action.payload;
      if (!state.contactActivities[contactId]) {
        state.contactActivities[contactId] = [];
      }
      state.contactActivities[contactId].push(activity);
    },
    setCompanyActivities: (state, action: PayloadAction<{ companyId: string, activities: Activity[] }>) => {
      const { companyId, activities } = action.payload;
      state.companyActivities[companyId] = activities;
    },
    addCompanyActivity: (state, action: PayloadAction<{ companyId: string, activity: Activity }>) => {
      const { companyId, activity } = action.payload;
      if (!state.companyActivities[companyId]) {
        state.companyActivities[companyId] = [];
      }
      state.companyActivities[companyId].push(activity);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setContactActivities,
  addContactActivity,
  setCompanyActivities,
  addCompanyActivity,
  setLoading,
  setError
} = activitiesSlice.actions;

export default activitiesSlice.reducer;

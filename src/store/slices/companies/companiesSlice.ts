
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Company } from '@/types/company';

interface CompaniesState {
  companies: Company[];
  selectedCompanies: string[];
  loading: boolean;
  error: string | null;
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Tech Innovators Inc.',
    website: 'https://techinnovators.com',
    industry: 'Information Technology',
    employeeCount: 1500,
    type: 'customer',
    status: 'active',
    description: 'Leading provider of enterprise software solutions',
    phone: '+1 (555) 123-4567',
    email: 'contact@techinnovators.com',
    location: {
      street: '789 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94105'
    },
    foundedYear: 1995,
    annualRevenue: 75000000,
    mainContact: 'Sarah Johnson',
    tierLevel: 'platinum',
    marketSegment: 'Enterprise',
    businessModel: 'b2b',
    preferredLanguage: 'English',
    timezone: 'America/Los_Angeles',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/techinnovators',
      twitter: 'https://twitter.com/techinnovators',
      facebook: 'https://facebook.com/techinnovators'
    },
    createdAt: new Date(2024, 0, 15).toISOString(),
    updatedAt: new Date(2024, 2, 15).toISOString(),
  },
  {
    id: '2',
    name: 'Global Solutions Corp',
    website: 'https://globalsolutions.com',
    industry: 'Business Services',
    employeeCount: 750,
    type: 'partner',
    status: 'active',
    description: 'International business consulting and solutions provider',
    phone: '+1 (555) 987-6543',
    email: 'info@globalsolutions.com',
    location: {
      street: '456 Business Avenue',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10013'
    },
    foundedYear: 2000,
    annualRevenue: 45000000,
    mainContact: 'Michael Chen',
    tierLevel: 'gold',
    marketSegment: 'Mid-Market',
    businessModel: 'b2b2c',
    preferredLanguage: 'English',
    timezone: 'America/New_York',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/globalsolutions',
      twitter: 'https://twitter.com/globalsolutions'
    },
    createdAt: new Date(2024, 1, 1).toISOString(),
    updatedAt: new Date(2024, 2, 10).toISOString(),
  },
  {
    id: '3',
    name: 'EcoTech Ventures',
    website: 'https://ecotechventures.com',
    industry: 'Clean Technology',
    employeeCount: 300,
    type: 'prospect',
    status: 'active',
    description: 'Innovative clean energy solutions provider',
    phone: '+1 (555) 456-7890',
    email: 'contact@ecotechventures.com',
    location: {
      street: '123 Green Street',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postalCode: '78701'
    },
    foundedYear: 2015,
    annualRevenue: 20000000,
    mainContact: 'Emma Rodriguez',
    tierLevel: 'silver',
    marketSegment: 'SMB',
    businessModel: 'b2b',
    preferredLanguage: 'English',
    timezone: 'America/Chicago',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/ecotech',
      twitter: 'https://twitter.com/ecotech'
    },
    createdAt: new Date(2024, 1, 15).toISOString(),
    updatedAt: new Date(2024, 2, 5).toISOString(),
  },
  {
    id: '4',
    name: 'Digital Dynamics Ltd',
    website: 'https://digitaldynamics.tech',
    industry: 'Digital Marketing',
    employeeCount: 150,
    type: 'customer',
    status: 'active',
    description: 'Digital transformation and marketing solutions',
    phone: '+1 (555) 789-0123',
    email: 'info@digitaldynamics.tech',
    location: {
      street: '321 Digital Lane',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      postalCode: '98101'
    },
    foundedYear: 2018,
    annualRevenue: 15000000,
    mainContact: 'David Kim',
    tierLevel: 'bronze',
    marketSegment: 'SMB',
    businessModel: 'b2c',
    preferredLanguage: 'English',
    timezone: 'America/Los_Angeles',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/digitaldynamics',
      twitter: 'https://twitter.com/digitaldynamics'
    },
    createdAt: new Date(2024, 2, 1).toISOString(),
    updatedAt: new Date(2024, 2, 15).toISOString(),
  },
  {
    id: '5',
    name: 'HealthTech Solutions',
    website: 'https://healthtechsolutions.com',
    industry: 'Healthcare Technology',
    employeeCount: 400,
    type: 'customer',
    status: 'active',
    description: 'Healthcare technology and software solutions',
    phone: '+1 (555) 234-5678',
    email: 'contact@healthtechsolutions.com',
    location: {
      street: '567 Medical Drive',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      postalCode: '02110'
    },
    foundedYear: 2010,
    annualRevenue: 30000000,
    mainContact: 'Jennifer Lee',
    tierLevel: 'gold',
    marketSegment: 'Enterprise',
    businessModel: 'b2b',
    preferredLanguage: 'English',
    timezone: 'America/New_York',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/healthtech',
      twitter: 'https://twitter.com/healthtech'
    },
    createdAt: new Date(2024, 2, 15).toISOString(),
    updatedAt: new Date(2024, 2, 15).toISOString(),
  },
];

const initialState: CompaniesState = {
  companies: mockCompanies,
  selectedCompanies: [],
  loading: false,
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async () => {
    // In a real app, this would be an API call
    return mockCompanies;
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
    },
    updateCompany: (state, action: PayloadAction<Partial<Company> & { id: string }>) => {
      const index = state.companies.findIndex(company => company.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = { ...state.companies[index], ...action.payload };
      }
    },
    deleteCompany: (state, action: PayloadAction<string>) => {
      state.companies = state.companies.filter(company => company.id !== action.payload);
    },
    setSelectedCompanies: (state, action: PayloadAction<string[]>) => {
      state.selectedCompanies = action.payload;
    },
    toggleCompanySelection: (state, action: PayloadAction<string>) => {
      const companyId = action.payload;
      const index = state.selectedCompanies.indexOf(companyId);
      if (index === -1) {
        state.selectedCompanies.push(companyId);
      } else {
        state.selectedCompanies.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch companies';
      });
  },
});

export const {
  addCompany,
  updateCompany,
  deleteCompany,
  setSelectedCompanies,
  toggleCompanySelection,
} = companiesSlice.actions;

export default companiesSlice.reducer;


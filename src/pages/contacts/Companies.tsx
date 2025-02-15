
import { CompaniesHeader } from '@/components/companies/CompaniesHeader';
import { CompaniesList } from '@/components/companies/CompaniesList';

const Companies = () => {
  return (
    <div className="px-6 space-y-6">
      <CompaniesHeader />
      <CompaniesList />
    </div>
  );
};

export default Companies;

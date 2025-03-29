
import { BaseService } from './BaseService';
import type { Company } from '@/types/company';

interface CompaniesResponse {
  data: Company[];
  total: number;
}

/**
 * Service for managing companies
 */
export class CompaniesService extends BaseService<Company> {
  protected endpoint = '/company';

  /**
   * Override getAll to handle pagination and filtering
   */
  async getAll(params?: Record<string, any>): Promise<CompaniesResponse> {
    const response = await this.request<CompaniesResponse>('get', this.endpoint, null, { params });
    return response.data;
  }

  /**
   * Get company contacts
   */
  async getCompanyContacts(companyId: string): Promise<any[]> {
    const response = await this.request<any[]>(
      'get',
      `${this.endpoint}/${companyId}/contacts`
    );
    return response.data;
  }

  /**
   * Get company by domain
   */
  async getByDomain(domain: string): Promise<Company | null> {
    try {
      const response = await this.request<Company>(
        'get',
        `${this.endpoint}/lookup`, 
        null,
        { params: { domain } }
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

// Export singleton instance
export const companiesService = new CompaniesService();

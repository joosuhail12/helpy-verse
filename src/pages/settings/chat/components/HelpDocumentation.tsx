
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Component for help and documentation links
 */
const HelpDocumentation = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Help & Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Installation guide
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Customization options
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Troubleshooting
            </a>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default HelpDocumentation;

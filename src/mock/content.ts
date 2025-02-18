
import { Content } from '@/types/content';
import { documentationContent } from './content/documentation';
import { salesContent } from './content/sales';
import { supportContent } from './content/support';
import { marketingContent } from './content/marketing';
import { productContent } from './content/product';
import { developmentContent } from './content/development';
import { hrContent } from './content/hr';
import { analyticsContent } from './content/analytics';

export const mockContent: Content[] = [
  ...documentationContent,
  ...salesContent,
  ...supportContent,
  ...marketingContent,
  ...productContent,
  ...developmentContent,
  ...hrContent,
  ...analyticsContent,
];


import type { EmailBlock } from './blocks';
import type { TemplateVariable } from './variables';

export type TemplateStatus = 'draft' | 'ready';

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  subject: string;
  status: TemplateStatus;
  lastModified: string;
  isBuiltIn: boolean;
}

export interface EmailTemplateSchema {
  schemaVersion: 1;
  template: TemplateMeta;
  variables: TemplateVariable[];
  blocks: EmailBlock[];
}

export type PreviewDevice = 'desktop' | 'mobile';

export type PreviewDataValues = Record<string, string>;

export type VariableType = 'string' | 'number';

export interface TemplateVariable {
  id: string;
  name: string;
  type: VariableType;
  description: string;
}

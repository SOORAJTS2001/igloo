export interface ParsedDocument {
  content: string;
  type: 'json' | 'csv' | 'xlsx' | 'text';
  preview?: string;
  formatted?: string;
}

export const parseDocument = (response:any) => {
  return response.map(item => item).join('\n');
};

import React from 'react';
import Editor from 'react-simple-code-editor';
import { Card } from '@/components/ui/card';
import { ParsedDocument } from '@/lib/document-parser';

interface DocumentViewerProps {
  content: string;
}

export function DocumentViewer({ content }: DocumentViewerProps) {

  return (
    <Card className="p-4 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div
        className="font-mono text-sm"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Card>
  );
}

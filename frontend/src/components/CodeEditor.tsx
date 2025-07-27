import React from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import { FileText, Code } from 'lucide-react';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500">
        <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-2">No File Selected</h3>
        <p className="text-sm text-zinc-600 text-center max-w-xs">
          Select a file from the explorer to view and edit its contents
        </p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden border border-zinc-800">
      <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 flex items-center gap-2">
        <Code className="w-4 h-4 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-300">{file.name}</span>
        <span className="text-xs text-zinc-500 ml-auto">Read Only</span>
      </div>
      <Editor
        height="calc(100% - 40px)"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={file.content || ''}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
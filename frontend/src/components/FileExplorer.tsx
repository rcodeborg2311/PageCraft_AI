import React, { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown, FolderOpen } from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer transition-all duration-150 group"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-zinc-400 group-hover:text-white transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {item.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <FolderTree className="w-4 h-4 text-blue-400" />
          )
        ) : (
          <File className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
        )}
        <span className="text-zinc-200 group-hover:text-white transition-colors text-sm font-medium">
          {item.name}
        </span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div className="ml-2 border-l border-zinc-800">
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <h2 className="text-lg font-semibold text-white">File Explorer</h2>
        <span className="ml-auto text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
          {files.length}
        </span>
      </div>
      
      <div className="space-y-1 overflow-auto h-[calc(100%-4rem)]">
        {files.length > 0 ? (
          files.map((file, index) => (
            <FileNode
              key={`${file.path}-${index}`}
              item={file}
              depth={0}
              onFileClick={onFileSelect}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <FolderTree className="w-8 h-8 text-zinc-600 mb-2" />
            <p className="text-zinc-500 text-sm">No files yet</p>
            <p className="text-zinc-600 text-xs">Generated files will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
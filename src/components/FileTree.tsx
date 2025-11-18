import { useState } from 'react';
import '../styles/filetree.css';

interface FileInfo {
  name: string;
  path: string;
  dir: string;
}

interface FileTreeProps {
  files: FileInfo[];
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

interface TreeNode {
  name: string;
  path?: string;
  children: Map<string, TreeNode>;
  isFile: boolean;
}

function buildTree(files: FileInfo[]): TreeNode {
  const root: TreeNode = {
    name: 'root',
    children: new Map(),
    isFile: false
  };

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLastPart = i === parts.length - 1;

      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          path: isLastPart ? file.path : undefined,
          children: new Map(),
          isFile: isLastPart
        });
      }

      current = current.children.get(part)!;
    }
  }

  return root;
}

function TreeNodeComponent({
  node,
  selectedFile,
  onFileSelect,
  level = 0
}: {
  node: TreeNode;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0 || level === 1);

  if (node.isFile) {
    return (
      <div
        className={`tree-item file ${selectedFile === node.path ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => node.path && onFileSelect(node.path)}
      >
        <span className="file-icon">📄</span>
        <span className="file-name">{node.name}</span>
      </div>
    );
  }

  const sortedChildren = Array.from(node.children.entries()).sort((a, b) => {
    // Directories first, then files
    if (!a[1].isFile && b[1].isFile) return -1;
    if (a[1].isFile && !b[1].isFile) return 1;
    return a[0].localeCompare(b[0]);
  });

  if (node.name === 'root') {
    return (
      <>
        {sortedChildren.map(([, child]) => (
          <TreeNodeComponent
            key={child.path || child.name}
            node={child}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            level={0}
          />
        ))}
      </>
    );
  }

  return (
    <div>
      <div
        className="tree-item directory"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
        <span className="folder-name">{node.name}</span>
      </div>
      {isExpanded && (
        <div className="tree-children">
          {sortedChildren.map(([, child]) => (
            <TreeNodeComponent
              key={child.path || child.name}
              node={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const FileTree = ({ files, selectedFile, onFileSelect }: FileTreeProps) => {
  const tree = buildTree(files);

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        <h3>Files</h3>
        <span className="file-count">{files.length} markdown files</span>
      </div>
      <div className="file-tree-content">
        <TreeNodeComponent
          node={tree}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
        />
      </div>
    </div>
  );
};

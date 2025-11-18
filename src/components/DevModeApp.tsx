import { useState } from 'react';
import { useFileList } from '../hooks/useFileList';
import { useMarkdown } from '../hooks/useMarkdown';
import { FileTree } from './FileTree';
import { MarkdownPreview } from './MarkdownPreview';
import { ErrorDisplay } from './ErrorDisplay';
import '../styles/devmode.css';

export const DevModeApp = () => {
  const { files, loading: filesLoading, error: filesError } = useFileList();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { content, filename, loading: markdownLoading, error: markdownError } = useMarkdown(selectedFile);

  if (filesLoading) {
    return (
      <div className="dev-loading">
        <p>Loading files...</p>
      </div>
    );
  }

  if (filesError) {
    return <ErrorDisplay error={filesError} />;
  }

  if (files.length === 0) {
    return (
      <div className="dev-empty">
        <h2>No Markdown Files Found</h2>
        <p>No .md files were found in the current directory.</p>
      </div>
    );
  }

  return (
    <div className="dev-container">
      <div className="dev-sidebar">
        <FileTree
          files={files}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />
      </div>
      <div className="dev-main">
        {!selectedFile ? (
          <div className="dev-placeholder">
            <h2>Welcome to md-preview</h2>
            <p>Select a markdown file from the sidebar to preview</p>
            <p className="file-count">{files.length} markdown files found</p>
          </div>
        ) : markdownLoading ? (
          <div className="dev-loading">
            <p>Loading markdown...</p>
          </div>
        ) : markdownError ? (
          <ErrorDisplay error={markdownError} />
        ) : content && filename ? (
          <MarkdownPreview content={content} filename={filename} />
        ) : (
          <div className="dev-placeholder">
            <p>No content available</p>
          </div>
        )}
      </div>
    </div>
  );
};

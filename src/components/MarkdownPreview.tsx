import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import '../styles/markdown.css';

interface MarkdownPreviewProps {
  content: string;
  filename: string;
}

export const MarkdownPreview = ({ content, filename }: MarkdownPreviewProps) => {
  return (
    <div className="markdown-container">
      <header className="markdown-header">
        <h1>{filename}</h1>
      </header>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

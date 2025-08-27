'use client';

import { useCallback, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import docker from 'react-syntax-highlighter/dist/cjs/languages/prism/docker';
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go';
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

(function registerSupportedLanguages() {
  const languages = {
    javascript,
    js: javascript,
    typescript,
    ts: typescript,
    jsx,
    tsx,
    css,
    scss,
    bash,
    shell: bash,
    json,
    python,
    py: python,
    go,
    rust,
    java,
    cpp,
    sql,
    yaml,
    yml: yaml,
    docker,
    dockerfile: docker
  };

  for (const lang in languages) {
    SyntaxHighlighter.registerLanguage(lang, languages[lang as keyof typeof languages]);
  }
})();

const DEFAULT_LANGUAGE = 'text';
const SYNTAX_HIGHLIGHTER_STYLE = vscDarkPlus;
const HIGHLIGHT_LINE_COLOR = 'rgba(255, 255, 255, 0.1)';

const customSyntaxHighlighterStyle: React.CSSProperties = {
  margin: 0,
  padding: '1rem',
  background: 'transparent',
  fontSize: '0.875rem',
  lineHeight: '1.5'
};

const lineNumberSyntaxHighlighterStyle: React.CSSProperties = {
  minWidth: '3em',
  paddingRight: '1em',
  color: '#6B7280',
  userSelect: 'none'
};

interface CodeBlockProps {
  children: string;
  language?: string;
  highlightLines?: Array<number>;
  className?: string;
  theme?: any;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language = DEFAULT_LANGUAGE,
  theme = SYNTAX_HIGHLIGHTER_STYLE,
  showLineNumbers = true,
  highlightLines = []
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (isCopied) return;

    navigator.clipboard
      .writeText(children.trim())
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err);
      });
  }, [children, isCopied]);

  const getLineProps = useCallback(
    (lineNumber: number): React.HTMLAttributes<HTMLElement> => {
      if (highlightLines.includes(lineNumber)) {
        return {
          style: {
            display: 'block',
            backgroundColor: HIGHLIGHT_LINE_COLOR
          }
        };
      }
      return {};
    },
    [highlightLines]
  );

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          disabled={isCopied}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={theme}
          customStyle={customSyntaxHighlighterStyle}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={lineNumberSyntaxHighlighterStyle}
          wrapLines={highlightLines.length > 0}
          lineProps={getLineProps}
        >
          {children.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function InlineCode({ children, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      className="rounded bg-gray-100 px-1.5 py-0.5 font-sans text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      {...props}
    >
      {children}
    </code>
  );
}

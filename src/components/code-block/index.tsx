'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useTheme } from '@/components/theme/theme-provider';
import { Theme } from '@/constants/theme';

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

type SyntaxTheme = Record<string, React.CSSProperties>;

const DEFAULT_LANGUAGE = 'text';
const DARK_STYLE: SyntaxTheme = vscDarkPlus as unknown as SyntaxTheme;
const LIGHT_STYLE: SyntaxTheme = oneLight as unknown as SyntaxTheme;
const HIGHLIGHT_LINE_COLOR_DARK = 'rgba(255, 255, 255, 0.08)';
const HIGHLIGHT_LINE_COLOR_LIGHT = 'rgba(255, 255, 0, 0.08)';

const customSyntaxHighlighterStyle: React.CSSProperties = {
  margin: 0,
  padding: '1rem',
  background: 'transparent',
  fontSize: '0.875rem',
  lineHeight: '1.5'
};

const codeTagInlineStyle: React.CSSProperties = {
  background: 'transparent',
  textShadow: 'none'
};

const lineNumberSyntaxHighlighterStyle: React.CSSProperties = {
  minWidth: '3em',
  paddingRight: '1em',
  color: 'var(--muted-foreground)',
  userSelect: 'none'
};

interface CodeBlockProps {
  children: string;
  language?: string;
  highlightLines?: Array<number>;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language = DEFAULT_LANGUAGE,
  showLineNumbers = true,
  highlightLines = []
}: CodeBlockProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === Theme.DARK;

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
            backgroundColor: isDarkMode ? HIGHLIGHT_LINE_COLOR_DARK : HIGHLIGHT_LINE_COLOR_LIGHT
          }
        };
      }
      return {};
    },
    [highlightLines, isDarkMode]
  );

  const resolvedStyle: SyntaxTheme = isDarkMode ? DARK_STYLE : LIGHT_STYLE;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{language}</span>
        {isMounted && (
          <button
            onClick={handleCopy}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            disabled={isCopied}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {isMounted && (
          <SyntaxHighlighter
            language={language}
            style={resolvedStyle}
            customStyle={customSyntaxHighlighterStyle}
            codeTagProps={{ style: codeTagInlineStyle }}
            showLineNumbers={showLineNumbers}
            lineNumberStyle={lineNumberSyntaxHighlighterStyle}
            wrapLines={highlightLines.length > 0}
            lineProps={getLineProps}
          >
            {children.trim()}
          </SyntaxHighlighter>
        )}
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

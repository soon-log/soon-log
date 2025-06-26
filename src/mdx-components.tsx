import type { MDXComponents } from 'mdx/types';

import { CodeBlock, InlineCode } from '@/components/code-block';
import { parseCodeMeta } from '@/lib/code';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-3xl font-bold" {...props} />,
    p: (props) => <p {...props} className="mb-3 leading-relaxed tracking-normal break-keep" />,
    code: ({ children, className, ...props }) => {
      if (className && className.startsWith('language-')) {
        const { language, highlightLines } = parseCodeMeta(className);
        return (
          <CodeBlock language={language} highlightLines={highlightLines}>
            {String(children)}
          </CodeBlock>
        );
      }

      // className이 없고 언어가 없으면 인라인 코드로 처리
      return <InlineCode {...props}>{children}</InlineCode>;
    },
    ...components
  };
}

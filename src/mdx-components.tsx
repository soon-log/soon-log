import type { MDXComponents } from 'mdx/types';

import { CodeBlock, InlineCode } from '@/components/code-block';
import { parseCodeMeta } from '@/utils/code';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="mt-12 mb-6 text-4xl font-bold" {...props} />,
    h2: (props) => <h2 className="mt-10 mb-5 text-3xl font-bold" {...props} />,
    h3: (props) => <h3 className="mt-8 mb-4 text-2xl font-bold" {...props} />,
    h4: (props) => <h4 className="mt-6 mb-3 text-xl font-semibold" {...props} />,
    h5: (props) => <h5 className="mt-5 mb-2 text-lg font-semibold" {...props} />,
    h6: (props) => <h6 className="mt-4 mb-1 text-base font-semibold" {...props} />,
    p: (props) => <p {...props} className="mb-4 leading-[22pt] tracking-normal break-keep" />,
    ul: (props) => <ul className="mb-4 list-disc pl-6 [&_ul]:mt-1" {...props} />,
    ol: (props) => <ol className="mb-4 list-decimal pl-6 [&_ol]:mt-1" {...props} />,
    li: (props) => <li className="mb-2 leading-relaxed" {...props} />,
    a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...props} />
    ),
    hr: (props) => <hr className="my-8 border-gray-200" {...props} />,
    code: ({ children, className, ...props }) => {
      if (className && className.startsWith('language-')) {
        const { language, highlightLines } = parseCodeMeta(className);
        return (
          <CodeBlock language={language} highlightLines={highlightLines}>
            {String(children)}
          </CodeBlock>
        );
      }
      return <InlineCode {...props}>{children}</InlineCode>;
    },
    ...components
  };
}

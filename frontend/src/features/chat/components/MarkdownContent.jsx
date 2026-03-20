import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from 'react-markdown';


const MarkdownContent = ({ content }) => (
    <ReactMarkdown
        components={{
            h1: ({ children }) => (
                <h1 className="mt-0 mb-5 text-xl sm:text-2xl md:text-3xl font-bold text-white">{children}</h1>
            ),
            h2: ({ children }) => (
                <h2 className="mt-6 mb-4 text-lg sm:text-xl md:text-2xl font-bold text-white">{children}</h2>
            ),
            h3: ({ children }) => (
                <h3 className="mt-4 mb-2 text-base sm:text-lg md:text-xl font-semibold text-gray-200">{children}</h3>
            ),
            p: ({ children }) => (
                <p className="mb-4 last:mb-0 text-xs sm:text-sm md:text-base leading-6 sm:leading-7 text-gray-200">{children}</p>
            ),
            ul: ({ children }) => (
                <ul className="mb-4 ml-4 sm:ml-5 space-y-2 list-disc">{children}</ul>
            ),
            ol: ({ children }) => (
                <ol className="mb-4 ml-4 sm:ml-5 space-y-2 list-decimal">{children}</ol>
            ),
            li: ({ children }) => (
                <li className="text-xs sm:text-sm md:text-base text-gray-300">{children}</li>
            ),
            code: ({ inline, className, children }) => {
                const match = /language-(\w+)/.exec(className || '');
                const lang = match ? match[1] : 'javascript';

                if (!inline) {
                    return (
                        <div className="mb-5 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700 overflow-x-auto">
                                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider whitespace-nowrap">
                                    {lang}
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(String(children))}
                                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700 flex-shrink-0"
                                >
                                    Copy
                                </button>
                            </div>
                            <SyntaxHighlighter
                                language={lang}
                                style={atomDark}
                                customStyle={{
                                    margin: 0,
                                    padding: '0.75rem 1rem',
                                    background: '#0d1117',
                                    fontSize: '0.75rem',
                                    lineHeight: '1.5',
                                }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    );
                }

                return (
                    <code className="rounded-md bg-gray-800 border border-gray-700 px-2 py-1 font-mono text-xs text-blue-300">
                        {children}
                    </code>
                );
            },
            pre: ({ children }) => <div className="mb-1">{children}</div>,
            blockquote: ({ children }) => (
                <div className="my-5 px-3 sm:px-4 py-3 rounded-lg bg-blue-500/10 border-l-4 border-blue-500 text-gray-300 text-xs sm:text-sm md:text-base">
                    {children}
                </div>
            ),
            hr: () => <hr className="my-4 border-gray-700" />,
            a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                    {children}
                </a>
            ),
            strong: ({ children }) => (
                <strong className="font-semibold text-gray-200 text-[1.02rem]">{children}</strong>
            ),
            em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
            table: ({ children }) => (
                <div className="mb-5 overflow-x-auto rounded-lg sm:rounded-xl border border-gray-700 bg-gray-900/50 -mx-3 sm:mx-0">
                    <table className="w-full text-xs sm:text-sm">{children}</table>
                </div>
            ),
            thead: ({ children }) => (
                <thead className="bg-gray-900 text-gray-200 border-b border-gray-700">{children}</thead>
            ),
            tbody: ({ children }) => (
                <tbody className="divide-y divide-gray-700">{children}</tbody>
            ),
            tr: ({ children }) => (
                <tr className="hover:bg-gray-800/30 transition-colors">{children}</tr>
            ),
            td: ({ children }) => <td className="px-3 sm:px-5 py-2 sm:py-3 text-gray-300">{children}</td>,
            th: ({ children }) => (
                <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold text-gray-100">{children}</th>
            ),
        }}
    >
        {content}
    </ReactMarkdown>
);


export default MarkdownContent;
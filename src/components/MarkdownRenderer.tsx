import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type MarkdownRendererProps = {
  markdown: string;
  /** Directory url (ending with /) for resolving relative images/links, e.g. /writeups/event/slug/ */
  baseUrl?: string;
  onImageClick?: (src: string) => void;
};

const isAbsolute = (s: string) => /^(https?:\/\/|\/|data:|#)/i.test(s);

const normalizeUrl = (u: string) => {
  // keep it simple: encode spaces to avoid broken markdown URLs
  return u.replace(/\s/g, "%20");
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const textFromChildren = (children: any): string => {
  if (children == null) return "";
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (typeof children === "object" && "props" in children) return textFromChildren((children as any).props?.children);
  return "";
};

const MarkdownRenderer = ({ markdown, baseUrl, onImageClick }: MarkdownRendererProps) => {
  const resolve = (src: string) => {
    const clean = normalizeUrl(src);
    if (!baseUrl || isAbsolute(clean)) return clean;
    return `${baseUrl}${clean}`;
  };

  // Stable heading IDs for TOC + smooth scrolling.
  const headingSeen = useMemo(() => new Map<string, number>(), [markdown]);
  const headingId = (label: string) => {
    const base = slugify(label || "section");
    const next = (headingSeen.get(base) ?? 0) + 1;
    headingSeen.set(base, next);
    return next === 1 ? base : `${base}-${next}`;
  };

  return (
    <div
      className="prose prose-invert max-w-none
        prose-p:text-foreground/95 prose-p:leading-relaxed
        prose-li:text-foreground/90
        prose-strong:text-foreground
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:text-primary/90
        prose-hr:border-border/40
        prose-blockquote:border-primary/30 prose-blockquote:text-foreground/85
        prose-pre:bg-background/25 prose-pre:border prose-pre:border-border/60 prose-pre:rounded-2xl
        prose-img:rounded-2xl prose-img:border prose-img:border-primary/20 prose-img:shadow-[0_20px_60px_rgba(0,0,0,0.55)]
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: ({ children, ...props }) => {
            const label = textFromChildren(children);
            const id = headingId(label);
            return (
              <h2
                id={id}
                className="scroll-mt-24 font-display text-xl md:text-2xl text-primary tracking-tight mt-12 mb-4 pt-4 border-t border-border/30"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const label = textFromChildren(children);
            const id = headingId(label);
            return (
              <h3
                id={id}
                className="scroll-mt-24 font-display text-lg md:text-xl text-primary/95 tracking-tight mt-10 mb-3 pt-3 border-t border-border/20"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => {
            const label = textFromChildren(children);
            const id = headingId(label);
            return (
              <h4
                id={id}
                className="scroll-mt-24 font-mono text-xs md:text-sm uppercase tracking-[0.22em] text-muted-foreground mt-8 mb-2"
                {...props}
              >
                {children}
              </h4>
            );
          },
          hr: (props) => (
            <hr
              className="my-10 border-0 h-px bg-gradient-to-r from-primary/35 via-border/30 to-transparent"
              {...props}
            />
          ),
          img: ({ src, alt, ...props }) => {
            const resolved = resolve(String(src ?? ""));
            return (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                src={resolved}
                alt={alt ?? ""}
                loading="lazy"
                className="cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                onClick={() => onImageClick?.(resolved)}
                {...props}
              />
            );
          },
          a: ({ href, children, ...props }) => {
            const h = String(href ?? "");
            const external = /^https?:\/\//i.test(h);
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

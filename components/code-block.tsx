import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  children: string;
  lang: BundledLanguage;
  filename?: string;
}

export async function CodeBlock({ children, lang, filename }: CodeBlockProps) {
  const out = await codeToHtml(children, {
    lang: lang,
    theme: "one-light",
  });

  return (
    <div
      className="[&>pre]:overflow-x-auto [&>pre]:!bg-background text-xs xl:text-base [&>pre]:py-3 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
      dangerouslySetInnerHTML={{ __html: out }}
    />
  );
}

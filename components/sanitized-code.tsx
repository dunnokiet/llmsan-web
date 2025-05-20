import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import { codeToHtml } from "shiki";
import { transformerNotationDiff } from "@shikijs/transformers";

export function SanitizedCode({ code }: { code: string }) {
  const [html, setHTML] = useState("");

  useEffect(() => {
    async function highlight() {
      const html = await codeToHtml(code, {
        lang: "javascript",
        theme: "one-light",
        transformers: [transformerNotationDiff()],
      });
      setHTML(html);
    }
    highlight();
  }, [code]);

  if (code.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
        <Wand2 className="h-12 w-12 mb-4" />
        <p>No sanitize generated yet</p>
      </div>
    );

  return (
    <div
      className="[&>pre]:overflow-x-auto [&>pre]:!bg-background [&>pre]:py-3 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

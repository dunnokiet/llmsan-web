import { createHighlighter, makeSingletonHighlighter } from 'shiki';


const getHighlighter = makeSingletonHighlighter(createHighlighter);

export const codeToHtml = async ({ code, lang }: any) => {

  const highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: lang,
  });

  return highlighter.codeToHtml(code, {
    lang: lang,
    themes: {
      dark: 'github-dark',
      light: 'github-light',
    },
  });
};
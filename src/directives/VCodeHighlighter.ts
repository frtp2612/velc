import type { Directive } from "vue";

type Rule = {
  id: string;
  lookFor: RegExp | string;
  substituteWith: Function;
};

const rules: Rule[] = [
  {
    id: "tags",
    lookFor: /(&lt;[\/]?)([a-z]+)([a-z|="{}| ]*&gt;)/gm,
    substituteWith: () => `$1<p class='font-semibold text-color-tag'>$2</p>$3`,
  },
  {
    id: "component-tags",
    lookFor: /(&lt;[\/]?)([A-Z]+[a-zA-Z]+)([a-zA-Z|\-:="{}| ]*[\/]?&gt;)/gm,
    substituteWith: () =>
      `$1<p class='font-semibold text-color-component-tag'>$2</p>$3`,
  },
  {
    id: "import",
    lookFor: /import|from|map|const|function/gm,
    substituteWith: () => `<p class='font-semibold text-color-tag-100'>$&</p>`,
  },
  {
    id: "language-syntax",
    lookFor: /Array/gm,
    substituteWith: () => `<p class='font-semibold text-color-tag-200'>$&</p>`,
  },
  {
    id: "vue-syntax",
    lookFor: /ref|v-model/gm,
    substituteWith: () => `<p class='font-semibold text-color-tag-300'>$&</p>`,
  },
];

const codeHighlighterDirective = (app: any) => {
  app.directive("code-highlighter", <Directive<HTMLElement, any>>{
    mounted(el: HTMLElement, _arg: any) {
      init(el);
    },
  });

  function init(el: HTMLElement) {
    el.querySelectorAll("code").forEach((codeBlock: HTMLElement) => {
      codeBlock.innerHTML = applyHighlightRules(codeBlock.textContent);
    });
  }
};

export function applyHighlightRules(text: string | null): string {
  if (text === null) return "";

  let highlightedTextContent = text;
  highlightedTextContent = highlightedTextContent.replace(/</gm, "&lt;");
  highlightedTextContent = highlightedTextContent.replace(/>/gm, "&gt;");

  rules.forEach((rule: Rule) => {
    highlightedTextContent = highlightedTextContent.replace(
      rule.lookFor,
      rule.substituteWith()
    );
  });

  return highlightedTextContent;
}

export default codeHighlighterDirective;

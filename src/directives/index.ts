import codeHighlighterDirective from "./VCodeHighlighter";
import tooltipDirective from "./VTooltip";

const directives = (app: any) => {
	tooltipDirective(app);
	codeHighlighterDirective(app);
};

export default directives;

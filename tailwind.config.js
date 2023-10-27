/** @type {import('tailwindcss').Config} */

const generateColorClass = (variable) => {
	console.log(variable);
	return `rgb(var(--${variable})
   / <alpha-value>)`;
};

const colors = {
	["theme-bg"]: {
		DEFAULT: generateColorClass("theme-bg"),
		50: generateColorClass("theme-bg-50"),
		100: generateColorClass("theme-bg-100"),
		200: generateColorClass("theme-bg-200"),
		300: generateColorClass("theme-bg-300"),
		400: generateColorClass("theme-bg-400"),
		500: generateColorClass("theme-bg-500"),
		600: generateColorClass("theme-bg-600"),
		700: generateColorClass("theme-bg-700"),
		800: generateColorClass("theme-bg-800"),
		900: generateColorClass("theme-bg-900"),
		950: generateColorClass("theme-bg-950"),
	},
	["theme-primary"]: {
		DEFAULT: generateColorClass("theme-primary"),
		50: generateColorClass("theme-primary-50"),
		100: generateColorClass("theme-primary-100"),
		200: generateColorClass("theme-primary-200"),
		300: generateColorClass("theme-primary-300"),
		400: generateColorClass("theme-primary-400"),
		500: generateColorClass("theme-primary-500"),
		600: generateColorClass("theme-primary-600"),
		700: generateColorClass("theme-primary-700"),
		800: generateColorClass("theme-primary-800"),
		900: generateColorClass("theme-primary-900"),
		950: generateColorClass("theme-primary-950"),
	},
	["theme-secondary"]: {
		DEFAULT: generateColorClass("theme-secondary"),
		50: generateColorClass("theme-secondary-50"),
		100: generateColorClass("theme-secondary-100"),
		200: generateColorClass("theme-secondary-200"),
		300: generateColorClass("theme-secondary-300"),
		400: generateColorClass("theme-secondary-400"),
		500: generateColorClass("theme-secondary-500"),
		600: generateColorClass("theme-secondary-600"),
		700: generateColorClass("theme-secondary-700"),
		800: generateColorClass("theme-secondary-800"),
		900: generateColorClass("theme-secondary-900"),
		950: generateColorClass("theme-secondary-950"),
	},
	["theme-accent"]: {
		DEFAULT: generateColorClass("theme-accent"),
		50: generateColorClass("theme-accent-50"),
		100: generateColorClass("theme-accent-100"),
		200: generateColorClass("theme-accent-200"),
		300: generateColorClass("theme-accent-300"),
		400: generateColorClass("theme-accent-400"),
		500: generateColorClass("theme-accent-500"),
		600: generateColorClass("theme-accent-600"),
		700: generateColorClass("theme-accent-700"),
		800: generateColorClass("theme-accent-800"),
		900: generateColorClass("theme-accent-900"),
		950: generateColorClass("theme-accent-950"),
	},
	["theme-success"]: {
		DEFAULT: generateColorClass("theme-success"),
	},
	["theme-error"]: {
		DEFAULT: generateColorClass("theme-error"),
	},
	["theme-text"]: {
		DEFAULT: generateColorClass("theme-text"),
		50: generateColorClass("theme-text-50"),
		100: generateColorClass("theme-text-100"),
		200: generateColorClass("theme-text-200"),
		300: generateColorClass("theme-text-300"),
		400: generateColorClass("theme-text-400"),
		500: generateColorClass("theme-text-500"),
		600: generateColorClass("theme-text-600"),
		700: generateColorClass("theme-text-700"),
		800: generateColorClass("theme-text-800"),
		900: generateColorClass("theme-text-900"),
		950: generateColorClass("theme-text-950"),
	},
	["theme-text-inverted"]: {
		DEFAULT: generateColorClass("theme-text-inverted"),
		50: generateColorClass("theme-text-inverted-50"),
		100: generateColorClass("theme-text-inverted-100"),
		200: generateColorClass("theme-text-inverted-200"),
		300: generateColorClass("theme-text-inverted-300"),
		400: generateColorClass("theme-text-inverted-400"),
		500: generateColorClass("theme-text-inverted-500"),
		600: generateColorClass("theme-text-inverted-600"),
		700: generateColorClass("theme-text-inverted-700"),
		800: generateColorClass("theme-text-inverted-800"),
		900: generateColorClass("theme-text-inverted-900"),
		950: generateColorClass("theme-text-inverted-950"),
	},
	["theme-nav"]: {
		DEFAULT: generateColorClass("theme-nav"),
		100: generateColorClass("theme-nav-100"),
	},
	["theme-tag"]: {
		DEFAULT: generateColorClass("theme-tag"),
		100: generateColorClass("theme-tag-100"),
		200: generateColorClass("theme-tag-200"),
		300: generateColorClass("theme-tag-300"),
	},
	["theme-component-tag"]: {
		DEFAULT: generateColorClass("theme-component-tag"),
	},
};

export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors,
		},
	},

	plugins: [],
};

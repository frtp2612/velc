/** @type {import('tailwindcss').Config} */

const generateColorClass = (variable) => {
  return `rgb(var(--${variable})
   / <alpha-value>)`;
};

const colors = {
  ["color-bg"]: {
    DEFAULT: generateColorClass("color-bg"),
    50: generateColorClass("color-bg-50"),
    100: generateColorClass("color-bg-100"),
    200: generateColorClass("color-bg-200"),
    300: generateColorClass("color-bg-300"),
    400: generateColorClass("color-bg-400"),
    500: generateColorClass("color-bg-500"),
    600: generateColorClass("color-bg-600"),
    700: generateColorClass("color-bg-700"),
    800: generateColorClass("color-bg-800"),
    900: generateColorClass("color-bg-900"),
  },
  ["color-border"]: {
    DEFAULT: generateColorClass("color-border"),
    50: generateColorClass("color-border-50"),
    100: generateColorClass("color-border-100"),
    200: generateColorClass("color-border-200"),
    300: generateColorClass("color-border-300"),
    400: generateColorClass("color-border-400"),
    500: generateColorClass("color-border-500"),
    600: generateColorClass("color-border-600"),
    700: generateColorClass("color-border-700"),
    800: generateColorClass("color-border-800"),
    900: generateColorClass("color-border-900"),
  },
  ["color-primary"]: {
    DEFAULT: generateColorClass("color-primary"),
    50: generateColorClass("color-primary-50"),
    100: generateColorClass("color-primary-100"),
    200: generateColorClass("color-primary-200"),
    300: generateColorClass("color-primary-300"),
    400: generateColorClass("color-primary-400"),
    500: generateColorClass("color-primary-500"),
    600: generateColorClass("color-primary-600"),
    700: generateColorClass("color-primary-700"),
    800: generateColorClass("color-primary-800"),
    900: generateColorClass("color-primary-900"),
  },
  ["color-secondary"]: {
    DEFAULT: generateColorClass("color-secondary"),
    50: generateColorClass("color-secondary-50"),
    100: generateColorClass("color-secondary-100"),
    200: generateColorClass("color-secondary-200"),
    300: generateColorClass("color-secondary-300"),
    400: generateColorClass("color-secondary-400"),
    500: generateColorClass("color-secondary-500"),
    600: generateColorClass("color-secondary-600"),
    700: generateColorClass("color-secondary-700"),
    800: generateColorClass("color-secondary-800"),
    900: generateColorClass("color-secondary-900"),
  },
  ["color-accent"]: {
    DEFAULT: generateColorClass("color-accent"),
    50: generateColorClass("color-accent-50"),
    100: generateColorClass("color-accent-100"),
    200: generateColorClass("color-accent-200"),
    300: generateColorClass("color-accent-300"),
    400: generateColorClass("color-accent-400"),
    500: generateColorClass("color-accent-500"),
    600: generateColorClass("color-accent-600"),
    700: generateColorClass("color-accent-700"),
    800: generateColorClass("color-accent-800"),
    900: generateColorClass("color-accent-900"),
  },
  ["color-success"]: {
    DEFAULT: generateColorClass("color-success"),
  },
  ["color-error"]: {
    DEFAULT: generateColorClass("color-error"),
  },
  ["color-alert"]: {
    DEFAULT: generateColorClass("color-alert"),
  },
  ["color-text"]: {
    DEFAULT: generateColorClass("color-text"),
    50: generateColorClass("color-text-50"),
    100: generateColorClass("color-text-100"),
    200: generateColorClass("color-text-200"),
    300: generateColorClass("color-text-300"),
    400: generateColorClass("color-text-400"),
    500: generateColorClass("color-text-500"),
    600: generateColorClass("color-text-600"),
    700: generateColorClass("color-text-700"),
    800: generateColorClass("color-text-800"),
    900: generateColorClass("color-text-900"),
  },
  ["color-nav"]: {
    DEFAULT: generateColorClass("color-nav"),
    100: generateColorClass("color-nav-100"),
  },
  ["color-tag"]: {
    DEFAULT: generateColorClass("color-tag"),
    100: generateColorClass("color-tag-100"),
    200: generateColorClass("color-tag-200"),
    300: generateColorClass("color-tag-300"),
  },
  ["color-component-tag"]: {
    DEFAULT: generateColorClass("color-component-tag"),
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

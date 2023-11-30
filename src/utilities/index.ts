export function deepEqual(obj1: any, obj2: any) {
	// Check if the two objects are of the same type
	if (typeof obj1 !== typeof obj2) {
		return false;
	}

	// If they are primitives, compare their values
	if (
		typeof obj1 !== "object" ||
		obj1 === null ||
		typeof obj2 !== "object" ||
		obj2 === null
	) {
		return obj1 === obj2;
	}

	// Get the keys of both objects
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	// Check if they have the same number of keys
	if (keys1.length !== keys2.length) {
		return false;
	}

	// Recursively compare the values of nested properties
	for (const key of keys1) {
		if (!deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	// If all checks pass, the objects are deep equal
	return true;
}

export function formatBytes(bytes: number, decimals = 2) {
	if (!+bytes) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = [
		"Bytes",
		"KiB",
		"MiB",
		"GiB",
		"TiB",
		"PiB",
		"EiB",
		"ZiB",
		"YiB",
	];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function RGBToHSL(
	r: number,
	g: number,
	b: number
): {
	h: number;
	s: number;
	l: number;
	formatted: string;
} {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	// Calculate hue
	// No difference
	if (delta == 0) h = 0;
	// Red is max
	else if (cmax == r) h = ((g - b) / delta) % 6;
	// Green is max
	else if (cmax == g) h = (b - r) / delta + 2;
	// Blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) h += 360;

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return { h, s, l, formatted: "hsl(" + h + "," + s + "%," + l + "%)" };
}

export function HSLToRGB(
	h: number,
	s: number,
	l: number,
	separator: string = " "
): {
	r: number;
	g: number;
	b: number;
	formatted: string;
} {
	// Must be fractions of 1
	// s /= 100;
	// l /= 100;

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
		m = l - c / 2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h <= 360) {
		r = c;
		g = 0;
		b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return {
		r,
		g,
		b,
		formatted: "rgb(" + r + separator + g + separator + b + ")",
	};
}

export function RGBToHSV(
	r: number,
	g: number,
	b: number
): {
	h: number;
	s: number;
	v: number;
} {
	(r = r / 255), (g = g / 255), (b = b / 255);
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h,
		s,
		v = max;

	var d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h! /= 6;
	}

	return { h: h!, s, v };
}

export function toRGBObject(rgbValue: string | undefined): {
	r: number;
	g: number;
	b: number;
} {
	if (rgbValue && rgbValue.match(/\d+/g) !== null) {
		const [r, g, b] = rgbValue.match(/\d+/g)!.map(Number);
		return { r, g, b };
	}
	return { r: 0, g: 0, b: 0 };
}

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function calculateLuminance(r: number, g: number, b: number) {
	var a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
	});
	return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

export function getContrast(
	rgb1: { r: number; g: number; b: number },
	rgb2: { r: number; g: number; b: number }
) {
	var lum1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
	var lum2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}

export function lerpFromTo(
	start: number,
	end: number,
	steps: number
): number[] {
	let result: number[] = [];
	for (let i = 0; i < steps; i++) {
		result.push(lerpOnceFromTo(start, end, i, steps));
	}
	return result;
}

export function lerpOnceFromTo(
	start: number,
	end: number,
	step: number,
	steps: number
): number {
	let v = step / steps;
	v = SMOOTHSTEP(v);
	return start * v + end * (1 - v);
}

function SMOOTHSTEP(x: number): number {
	return x * x * (3 - 2 * x);
}

export function loadTheme(themeData: string[]) {
	themeData.forEach((themeColor: string) => {
		const colorData = themeColor.split(": ");
		document.body.style.setProperty(colorData[0], colorData[1]);
	});
}

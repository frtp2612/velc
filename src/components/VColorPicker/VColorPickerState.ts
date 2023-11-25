import { HSLToRGB, RGBToHSL, RGBToHSV } from "@/utilities/index";
import { Ref, ref } from "vue";
import { toRGBObject } from "../../utilities/index";

export function VColorPickerState(color: Ref<string | undefined>) {
  let canvasContext: CanvasRenderingContext2D;
  let hueCanvasContext: CanvasRenderingContext2D;

  let canvasRect: DOMRect | undefined;
  let hueCanvasRect: DOMRect | undefined;

  const canvasRef = ref<HTMLCanvasElement>();
  const hueCanvasRef = ref<HTMLCanvasElement>();
  const pickerRef = ref<HTMLElement>();
  const huePickerRef = ref<HTMLElement>();

  const canvasWidth = ref(0);
  const canvasHeight = ref(0);
  const hueCanvasWidth = ref(0);
  const hueCanvasHeight = ref(0);

  const lightness = ref(0.5);
  const saturation = ref(1);
  const hue = ref(0);

  const actualHueValue = ref(0);
  const actualSaturationValue = ref(0);

  // const color = ref<string | undefined>(initialValue);
  const hueColor = ref<string | undefined>();
  const colorBreakdown = ref<{
    r: Ref<number | null>;
    g: Ref<number | null>;
    b: Ref<number | null>;
  }>({
    r: ref(null),
    g: ref(null),
    b: ref(null),
  });

  function breakDownColor() {
    const { r, g, b } = toRGBObject(color.value);
    colorBreakdown.value.r = r;
    colorBreakdown.value.g = g;
    colorBreakdown.value.b = b;
  }

  function init(
    canvas: HTMLCanvasElement,
    hueCanvas: HTMLCanvasElement,
    picker: HTMLElement,
    huePicker: HTMLElement
  ) {
    canvasRef.value = canvas;
    hueCanvasRef.value = hueCanvas;
    pickerRef.value = picker;
    huePickerRef.value = huePicker;

    canvasContext = canvas.getContext("2d")!;
    hueCanvasContext = hueCanvas.getContext("2d")!;

    canvasWidth.value = canvasContext.canvas.width;
    canvasHeight.value = canvasContext.canvas.height;

    hueCanvasWidth.value = hueCanvasContext.canvas.width;
    hueCanvasHeight.value = hueCanvasContext.canvas.height;

    initializeCanvasGradient();
    initializeHueGradient();
    addListeners();

    updateSpectrumCursor(0, 0);
    updateHueCursor(0);

    breakDownColor();
    colorToPos();
  }

  function initializeCanvasGradient(hue?: string) {
    canvasContext.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    if (!hue) hue = "rgb(255,0,0)";
    canvasContext.fillStyle = hue;
    canvasContext.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

    // Create a horizontal gradient
    let whiteGradient = canvasContext?.createLinearGradient(
      0,
      0,
      canvasWidth.value,
      0
    );
    whiteGradient.addColorStop(0, "#fff");
    whiteGradient.addColorStop(1, "transparent");
    canvasContext.fillStyle = whiteGradient;
    canvasContext.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

    // Create a Vertical Gradient(transparent to black)
    let blackGradient = canvasContext?.createLinearGradient(
      0,
      0,
      0,
      canvasHeight.value
    );
    blackGradient.addColorStop(0, "transparent");
    blackGradient.addColorStop(1, "#000");

    canvasContext.fillStyle = blackGradient;
    canvasContext.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

    canvasRect = canvasRef.value?.getBoundingClientRect();
  }

  function initializeHueGradient() {
    var hueGradient = hueCanvasContext.createLinearGradient(
      0,
      0,
      0,
      hueCanvasHeight.value
    );
    hueGradient.addColorStop(0.0, "hsl(0, 100%, 50%)");
    hueGradient.addColorStop(0.17, "hsl(298.8, 100%, 50%)");
    hueGradient.addColorStop(0.33, "hsl(241.2, 100%, 50%)");
    hueGradient.addColorStop(0.5, "hsl(180, 100%, 50%)");
    hueGradient.addColorStop(0.67, "hsl(118.8, 100%, 50%)");
    hueGradient.addColorStop(0.83, "hsl(61.2, 100%, 50%)");
    hueGradient.addColorStop(1.0, "hsl(360, 100%, 50%)");
    hueCanvasContext.fillStyle = hueGradient;
    hueCanvasContext.fillRect(
      0,
      0,
      hueCanvasWidth.value,
      hueCanvasHeight.value
    );

    hueCanvasRect = hueCanvasRef.value?.getBoundingClientRect();
  }

  function addListeners() {
    canvasRef.value?.addEventListener("mousedown", onCanvasMouseDown);
    pickerRef.value?.addEventListener("mousedown", onCanvasMouseDown);
    hueCanvasRef.value?.addEventListener("mousedown", onHueCanvasMouseDown);
    huePickerRef.value?.addEventListener("mousedown", onHueCanvasMouseDown);
  }

  function onCanvasMouseDown() {
    canvasRect = canvasRef.value?.getBoundingClientRect();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onHueCanvasMouseDown() {
    hueCanvasRect = hueCanvasRef.value?.getBoundingClientRect();

    document.addEventListener("mousemove", onHueCanvasMouseMove);
    document.addEventListener("mouseup", onHueCanvasMouseUp);
  }

  function onMouseMove(event: MouseEvent) {
    applySpectrumCorrection(event.clientX, event.clientY);
  }

  function onHueCanvasMouseMove(event: MouseEvent) {
    applyHueCorrection(event.clientX, event.pageY);
  }

  function onMouseUp(event: MouseEvent) {
    applySpectrumCorrection(event.clientX, event.clientY);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  }

  function onHueCanvasMouseUp(event: MouseEvent) {
    applyHueCorrection(event.clientX, event.pageY);
    document.removeEventListener("mouseup", onHueCanvasMouseUp);
    document.removeEventListener("mousemove", onHueCanvasMouseMove);
  }

  function applySpectrumCorrection(x: number, y: number) {
    x -= canvasRect?.left || 0;
    y -= canvasRect?.top || 0;

    if (x > canvasRect!.width) {
      x = canvasRect!.width;
    }
    if (x <= 0) {
      x = 0;
    }
    if (y > canvasRect!.height) {
      y = canvasRect!.height;
    }
    if (y <= 0) {
      y = 0;
    }

    var xRatio = (x / canvasRect!.width) * 100;
    var yRatio = (y / canvasRect!.height) * 100;
    var hsvValue = 1 - yRatio / 100;
    var hsvSaturation = xRatio / 100;
    lightness.value = (hsvValue / 2) * (2 - hsvSaturation);
    saturation.value =
      (hsvValue * hsvSaturation) /
      Math.max(0.1, 1 - Math.abs(2 * lightness.value - 1));

    const color = HSLToRGB(hue.value, saturation.value, lightness.value);
    updateSpectrumCursor(x, y);
    updateColor(color);

    // console.log([hue.value, saturation.value, lightness.value]);
  }

  function applyHueCorrection(x: number, y: number) {
    let percentage = 0;
    let offset = 0;

    y = y - hueCanvasRect!.top;

    if (hueCanvasHeight.value > hueCanvasWidth.value) {
      if (y > hueCanvasHeight.value) {
        y = hueCanvasHeight.value;
      }
      if (y < 0) {
        y = 0;
      }
      percentage = y / hueCanvasHeight.value;
      offset = y;
    } else {
      if (x > hueCanvasWidth.value) {
        x = hueCanvasWidth.value;
      }
      if (x < 0) {
        x = 0.1;
      }

      percentage = x / hueCanvasWidth.value;
      offset = x;
    }

    hue.value = 360 - 360 * percentage;

    const hueRGB = HSLToRGB(hue.value, 1, 0.5);
    const color = HSLToRGB(hue.value, saturation.value, lightness.value);
    updateColor(color);
    updateHue(hueRGB.formatted);
    actualSaturationValue.value = saturation.value;
    actualHueValue.value = hue.value;

    initializeCanvasGradient(hueRGB.formatted);
    updateHueCursor(offset);
  }

  function updateColor(newColor: {
    r: number;
    g: number;
    b: number;
    formatted: string;
  }) {
    color.value = newColor.formatted;
    colorBreakdown.value.r = newColor.r;
    colorBreakdown.value.g = newColor.g;
    colorBreakdown.value.b = newColor.b;
  }

  function updateHue(formatted: string) {
    hueColor.value = formatted;
  }

  function updateSpectrumCursor(x: number, y: number) {
    pickerRef.value?.style.setProperty("--x", x + "px");
    pickerRef.value?.style.setProperty("--y", y + "px");
  }

  function updateHueCursor(offset: number) {
    huePickerRef.value?.style.setProperty("--offset", offset + "px");
  }

  function updateColorFromRGB() {
    color.value = `rgb(${colorBreakdown.value.r}, ${colorBreakdown.value.g}, ${colorBreakdown.value.b})`;
    colorToPos();
  }

  function colorToPos() {
    var newColor = RGBToHSL(
      colorBreakdown.value.r || 0,
      colorBreakdown.value.g || 0,
      colorBreakdown.value.b || 0
    );
    var hsv = RGBToHSV(
      colorBreakdown.value.r || 0,
      colorBreakdown.value.g || 0,
      colorBreakdown.value.b || 0
    );

    hue.value = newColor.h;
    saturation.value = newColor.s / 100;

    lightness.value = newColor.l / 100;

    var x = canvasWidth.value * hsv.s;
    var y = canvasHeight.value * (1 - hsv.v);

    var hueY =
      hueCanvasHeight.value - (hue.value / 360) * hueCanvasHeight.value;
    const hueRGB = HSLToRGB(hue.value, 1, 0.5);

    actualSaturationValue.value = saturation.value;
    actualHueValue.value = hue.value;

    updateSpectrumCursor(x, y);
    updateHueCursor(hueY);
    updateHue(hueRGB.formatted);
    initializeCanvasGradient(hueRGB.formatted);
  }

  return {
    init,
    color,
    colorBreakdown,
    hueColor,
    hue,
    actualHueValue,
    actualSaturationValue,

    updateColorFromRGB,
  };
}

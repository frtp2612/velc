import { ref } from "vue";
import { HSLToRGB } from "../../utilities/index";
export function VColorPickerState() {
  let canvasContext: CanvasRenderingContext2D;
  let hueCanvasContext: CanvasRenderingContext2D;

  let canvasRect: DOMRect | undefined;

  const canvasRef = ref<HTMLCanvasElement>();
  const hueCanvasRef = ref<HTMLCanvasElement>();
  const pickerRef = ref<HTMLElement>();

  const canvasWidth = ref(0);
  const canvasHeight = ref(0);
  const hueCanvasWidth = ref(0);
  const hueCanvasHeight = ref(0);

  const lightness = ref(0);
  const saturation = ref(0);
  const hue = ref(0);

  const color = ref();

  function init(
    canvas: HTMLCanvasElement,
    hueCanvas: HTMLCanvasElement,
    picker: HTMLElement
  ) {
    canvasRef.value = canvas;
    hueCanvasRef.value = hueCanvas;
    pickerRef.value = picker;

    canvasContext = canvas.getContext("2d")!;
    hueCanvasContext = hueCanvas.getContext("2d")!;

    canvasWidth.value = canvasContext.canvas.width;
    canvasHeight.value = canvasContext.canvas.height;

    hueCanvasWidth.value = hueCanvasContext.canvas.width;
    hueCanvasHeight.value = hueCanvasContext.canvas.height;

    initializeCanvasGradient();
    initializeHueGradient();
    addListeners();
  }

  function initializeCanvasGradient() {
    canvasContext.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    if (!color.value) color.value = "rgb(255,0,0)";
    canvasContext.fillStyle = color.value;
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
  }

  function addListeners() {
    canvasRef.value?.addEventListener("mousedown", onMouseDown);
    pickerRef.value?.addEventListener("mousedown", onMouseDown);
  }

  function onMouseDown() {
    canvasRect = canvasRef.value?.getBoundingClientRect();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(event: MouseEvent) {
    applyCorrection(event.clientX, event.clientY);
  }

  function onMouseUp(event: MouseEvent) {
    applyCorrection(event.clientX, event.clientY);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  }

  function applyCorrection(x: number, y: number): { x: number; y: number } {
    x -= canvasRect?.left || 0;
    y -= canvasRect?.top || 0;

    if (x > canvasWidth.value) {
      x = canvasWidth.value;
    }
    if (x <= 0) {
      x = 0.1;
    }
    if (y > canvasHeight.value) {
      y = canvasHeight.value;
    }
    if (y <= 0) {
      y = 0.1;
    }

    var xRatio = (x / canvasWidth.value) * 100;
    var yRatio = (y / canvasHeight.value) * 100;
    var hsvValue = 1 - yRatio / 100;
    var hsvSaturation = xRatio / 100;
    lightness.value = (hsvValue / 2) * (2 - hsvSaturation);
    saturation.value =
      (hsvValue * hsvSaturation) /
      Math.max(0.1, 1 - Math.abs(2 * lightness.value - 1));
    // console.log("BEFORE CORRECTION: ", [
    //   x,
    //   y,
    //   xRatio,
    //   yRatio,
    //   hsvValue,
    //   hsvSaturation,
    //   lightness.value,
    //   saturation.value,
    // ]);
    const { formatted } = HSLToRGB(
      hue.value,
      saturation.value,
      lightness.value
    );
    // console.log("CORRECTED COLOR: ", formatted);

    color.value = formatted;
    updateSpectrumCursor(x, y);

    return { x, y };
  }

  function updateSpectrumCursor(x: number, y: number) {
    pickerRef.value?.style.setProperty("--x", x + "px");
    pickerRef.value?.style.setProperty("--y", y + "px");
  }

  return {
    init,
    color,
  };
}

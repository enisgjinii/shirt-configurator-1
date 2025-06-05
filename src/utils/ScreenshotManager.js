import html2canvas from 'html2canvas';

export class ScreenshotManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
  }

  // Take a high-quality screenshot
  async takeScreenshot(format = 'png', quality = 0.9, resolution = '1920x1080') {
    if (!this.canvas) return null;

    const [width, height] = resolution.split('x').map(Number);
    
    // Create a temporary canvas with desired resolution
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');

    // Scale and draw the original canvas
    ctx.drawImage(this.canvas, 0, 0, width, height);

    return new Promise((resolve) => {
      tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      }, `image/${format}`, quality);
    });
  }

  // Take a screenshot with custom settings
  async takeCustomScreenshot(options = {}) {
    const {
      format = 'png',
      quality = 0.9,
      resolution = '1920x1080',
      includeUI = false,
      watermark = null
    } = options;

    let targetElement = this.canvas;

    if (includeUI) {
      // Take screenshot of entire viewport
      const element = document.body;
      return html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        width: parseInt(resolution.split('x')[0]),
        height: parseInt(resolution.split('x')[1])
      }).then(canvas => {
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            resolve({ blob, url });
          }, `image/${format}`, quality);
        });
      });
    }

    return this.takeScreenshot(format, quality, resolution);
  }

  // Download screenshot
  downloadScreenshot(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default ScreenshotManager;


import { createCanvas, loadImage } from '@napi-rs/canvas';

const TEMPLATE_URL = 'https://raw.githubusercontent.com/aldii-gh/canvas-gen/refs/heads/main/patrickmemegen/patrickmeme.png';

let templatePromise;

async function getTemplate() {
  if (!templatePromise) {
    templatePromise = (async () => {
      const response = await fetch(TEMPLATE_URL);

      if (!response.ok) {
        throw new Error(`Template HTTP ${response.status}`);
      }

      return loadImage(Buffer.from(await response.arrayBuffer()));
    })().catch(error => {
      templatePromise = null;
      throw error;
    });
  }

  return templatePromise;
}

export async function createPatrickMeme(photoBuffer, options = {}) {
  if (!Buffer.isBuffer(photoBuffer) || !photoBuffer.length) {
    throw new TypeError('photoBuffer harus berupa Buffer yang valid');
  }

  const {
    fieldLeft = 65,
    fieldRight = 1080,
    fieldTop = 700,
    fieldBottom = 1105,
    faceShiftX = -35,
    curveAmount = 15,
    rotation = 90
  } = options;

  const [template, photo] = await Promise.all([
    getTemplate(),
    loadImage(photoBuffer)
  ]);

  const W = template.width;
  const H = template.height;
  const canvas = createCanvas(W, H);
  const c = canvas.getContext('2d');

  c.fillStyle = '#FFFFFF';
  c.fillRect(0, 0, W, H);

  const sx = W / 1280;
  const sy = H / 1280;
  const left = fieldLeft * sx;
  const right = fieldRight * sx;
  const top = fieldTop * sy;
  const bottom = fieldBottom * sy;
  const fieldW = right - left;
  const fieldH = bottom - top;

  const angle = (rotation * Math.PI) / 180;
  const rotated = createCanvas(photo.height, photo.width);
  const rc = rotated.getContext('2d');

  rc.translate(rotated.width / 2, rotated.height / 2);
  rc.rotate(angle);
  rc.drawImage(photo, -photo.width / 2, -photo.height / 2);

  const fitted = createCanvas(
    Math.ceil(fieldW),
    Math.ceil(fieldH)
  );

  fitted.getContext('2d').drawImage(
    rotated,
    0,
    0,
    fitted.width,
    fitted.height
  );

  c.save();

  const strips = 240;
  const amplitude = curveAmount * sy;

  for (let i = 0; i < strips; i++) {
    const t = i / strips;
    const sourceX = Math.floor(t * fitted.width);
    const sourceW = Math.max(1, Math.ceil(fitted.width / strips));
    const curve = Math.sin(t * Math.PI);
    const bend = curve * amplitude;

    c.drawImage(
      fitted,
      sourceX,
      0,
      sourceW,
      fitted.height,
      left + t * fieldW + faceShiftX * sx * curve,
      top + bend,
      fieldW / strips + 1,
      fieldH - bend * 0.5
    );
  }

  c.restore();
  c.drawImage(template, 0, 0, W, H);

  return canvas.encode('png');
}

export default createPatrickMeme;

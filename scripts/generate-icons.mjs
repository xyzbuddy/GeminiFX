// Generates the PROVISIONAL GeminiFX icon (public/icons/icon-{16,32,48,128}.png)
// with no dependencies. Original geometric mark: charcoal rounded square,
// light ring with a small offset dot. Final icon design is PENDING owner approval.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Shape test in unit coordinates (0..1). Returns [r,g,b,a] or null.
const BG = [33, 33, 33];
const FG = [236, 236, 236];
function sample(u, v) {
  const r = 0.22; // corner radius
  const cx = Math.min(Math.max(u, r), 1 - r);
  const cy = Math.min(Math.max(v, r), 1 - r);
  if (Math.hypot(u - cx, v - cy) > r) return null; // outside rounded square
  const d = Math.hypot(u - 0.46, v - 0.54);
  if (d > 0.2 && d < 0.29) return FG; // ring
  if (Math.hypot(u - 0.72, v - 0.28) < 0.085) return FG; // offset dot
  return BG;
}

function render(size) {
  const ss = 4; // supersampling for anti-aliasing
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let rs = 0, gs = 0, bs = 0, hits = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const c = sample((x + (sx + 0.5) / ss) / size, (y + (sy + 0.5) / ss) / size);
          if (c) { rs += c[0]; gs += c[1]; bs += c[2]; hits++; }
        }
      }
      const i = (y * size + x) * 4;
      if (hits) {
        buf[i] = Math.round(rs / hits);
        buf[i + 1] = Math.round(gs / hits);
        buf[i + 2] = Math.round(bs / hits);
        buf[i + 3] = Math.round((hits / (ss * ss)) * 255);
      }
    }
  }
  return encodePng(size, buf);
}

for (const size of [16, 32, 48, 128]) {
  writeFileSync(resolve(outDir, `icon-${size}.png`), render(size));
  console.log(`wrote icons/icon-${size}.png`);
}

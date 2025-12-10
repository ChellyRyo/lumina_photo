import { CameraBrand } from './types';

// Reverted to Network URLs as requested.
// Using cdn.simpleicons.org for reliable, CORS-friendly SVG logos where possible.
export const BRAND_LOGOS: Record<CameraBrand, string> = {
  [CameraBrand.Fujifilm]: "https://cdn.simpleicons.org/fujifilm",
  [CameraBrand.Sony]: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
  [CameraBrand.Canon]: "https://cdn.simpleicons.org/canon",
  [CameraBrand.Nikon]: "https://cdn.simpleicons.org/nikon",
  [CameraBrand.Leica]: "https://cdn.simpleicons.org/leica",
  [CameraBrand.Apple]: "https://cdn.simpleicons.org/apple",
  [CameraBrand.Samsung]: "https://cdn.simpleicons.org/samsung",
  [CameraBrand.Google]: "https://cdn.simpleicons.org/google",
  [CameraBrand.Xiaomi]: "https://cdn.simpleicons.org/xiaomi",
  [CameraBrand.Huawei]: "https://cdn.simpleicons.org/huawei",
  [CameraBrand.Olympus]: "https://upload.wikimedia.org/wikipedia/commons/0/05/Olympus_Corporation_logo.svg",
  [CameraBrand.Panasonic]: "https://cdn.simpleicons.org/panasonic",
  [CameraBrand.Hasselblad]: "https://upload.wikimedia.org/wikipedia/commons/6/65/Hasselblad_logo.svg",
  [CameraBrand.Ricoh]: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Ricoh_logo.svg",
  [CameraBrand.Pentax]: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Pentax_logo.svg",
  [CameraBrand.Oppo]: "https://cdn.simpleicons.org/oppo",
  [CameraBrand.Vivo]: "https://cdn.simpleicons.org/vivo",
  [CameraBrand.OnePlus]: "https://cdn.simpleicons.org/oneplus",
  [CameraBrand.Realme]: "https://cdn.simpleicons.org/realme",
  [CameraBrand.Unknown]: ""
};

export const DETECT_BRAND = (make: string, model: string): CameraBrand => {
  const m = (make || '').toLowerCase();
  const mo = (model || '').toLowerCase();
  
  const has = (keyword: string) => m.includes(keyword) || mo.includes(keyword);
  
  if (has('fuji')) return CameraBrand.Fujifilm;
  if (has('sony')) return CameraBrand.Sony;
  if (has('canon')) return CameraBrand.Canon;
  if (has('nikon')) return CameraBrand.Nikon;
  if (has('leica')) return CameraBrand.Leica;
  if (has('apple') || has('iphone') || has('ipad')) return CameraBrand.Apple;
  if (has('samsung') || has('galaxy')) return CameraBrand.Samsung;
  if (has('google') || has('pixel')) return CameraBrand.Google;
  if (has('xiaomi') || has('redmi') || has('poco') || has('mi ')) return CameraBrand.Xiaomi;
  if (has('huawei') || has('honor')) return CameraBrand.Huawei;
  if (has('olympus') || has('om digi')) return CameraBrand.Olympus;
  if (has('panasonic') || has('lumix')) return CameraBrand.Panasonic;
  if (has('hasselblad')) return CameraBrand.Hasselblad;
  if (has('ricoh')) return CameraBrand.Ricoh;
  if (has('pentax')) return CameraBrand.Pentax;
  
  // BBK brands
  if (has('oppo')) return CameraBrand.Oppo;
  if (has('vivo')) return CameraBrand.Vivo;
  if (has('oneplus')) return CameraBrand.OnePlus;
  if (has('realme')) return CameraBrand.Realme;

  return CameraBrand.Unknown;
};
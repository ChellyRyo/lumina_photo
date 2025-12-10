export interface ExifData {
  make: string;
  model: string;
  fNumber: string;
  exposureTime: string;
  iso: string;
  focalLength: string;
  dateTimeOriginal: string;
  lensModel?: string;
}

export interface WatermarkSettings {
  showExif: boolean;
  showLogo: boolean;
  showFilename: boolean;
  customTitle: string;
  backgroundColor: string;
  textColor: string;
  padding: number;
  aspectRatio: 'original' | '1:1' | '4:5' | '16:9';
  layoutStyle: 'card' | 'classic' | 'clean';
}

export enum CameraBrand {
  Fujifilm = 'Fujifilm',
  Sony = 'Sony',
  Canon = 'Canon',
  Nikon = 'Nikon',
  Leica = 'Leica',
  Apple = 'Apple',
  Samsung = 'Samsung',
  Google = 'Google',
  Xiaomi = 'Xiaomi',
  Huawei = 'Huawei',
  Olympus = 'Olympus',
  Panasonic = 'Panasonic',
  Hasselblad = 'Hasselblad',
  Ricoh = 'Ricoh',
  Pentax = 'Pentax',
  Oppo = 'Oppo',
  Vivo = 'Vivo',
  OnePlus = 'OnePlus',
  Realme = 'Realme',
  Unknown = 'Unknown'
}
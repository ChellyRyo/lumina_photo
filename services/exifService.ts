import ExifReader from 'exifreader';
import { ExifData } from '../types';

export const parseExif = async (file: File): Promise<ExifData> => {
  const tags = await ExifReader.load(file);
  
  // Helper to safely get string value
  const getTag = (tag: string) => {
    return tags[tag]?.description || '';
  };

  // Helper for fractional formatting (e.g., 1/100)
  const getExposure = () => {
    const exp = tags['ExposureTime']?.value;
    if (!exp) return '';
    return tags['ExposureTime']?.description || '';
  };

  // Format date to YYYY.MM.DD
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Typical EXIF format: "YYYY:MM:DD HH:MM:SS"
    // We want "YYYY.MM.DD"
    const match = dateStr.match(/^(\d{4})[:/-](\d{2})[:/-](\d{2})/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}`;
    }
    return dateStr.split(' ')[0].replace(/:/g, '.');
  };

  // Clean up Make/Model strings (remove nulls, trim)
  const cleanString = (str: string) => {
    return str.replace(/\0/g, '').trim();
  };

  return {
    make: cleanString(getTag('Make')),
    model: cleanString(getTag('Model')),
    fNumber: getTag('FNumber'),
    exposureTime: getExposure(),
    iso: getTag('ISOSpeedRatings') || getTag('ISO'),
    focalLength: getTag('FocalLength'),
    dateTimeOriginal: formatDate(getTag('DateTimeOriginal')),
    lensModel: cleanString(getTag('LensModel') || getTag('Lens'))
  };
};
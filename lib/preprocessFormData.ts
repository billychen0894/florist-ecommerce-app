interface ProcessedFormData {
  [key: string]: string | number | boolean | object | undefined;
  images?: {
    existingImages?: { url: string; publicId: string }[];
    newImages?: File[];
  };
}

export function preprocessFormData(formData: FormData): ProcessedFormData {
  let obj: ProcessedFormData = {
    images: {
      newImages: [],
    },
  };

  formData.forEach((value, key) => {
    switch (key) {
      case 'price':
      case 'units':
        obj[key] = Number(value);
        break;
      case 'inStock':
        obj[key] = value === 'true';
        break;
      case 'categories':
      case 'productDetail':
        obj[key] = JSON.parse(value as any);
        break;
      case 'existingImages':
        obj['images'] = {
          ...obj['images'],
          existingImages: JSON.parse(value as any),
        };
        break;
      case 'newImages[]':
        obj['images'] = {
          ...obj['images'],
          newImages: [...(obj['images']?.newImages ?? []), value as File],
        };
        break;
      default:
        obj[key] = value;
    }
  });

  return obj;
}

import { v2 } from 'cloudinary';
import { cloudinaryConfig } from 'src/configs/cloudinary.config';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): void => {
    v2.config(cloudinaryConfig);
  },
};

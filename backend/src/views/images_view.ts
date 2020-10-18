/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Image from '../models/Image';

export default {
  render(image: Image) {
    return {
      id: image.id,
      image_url: `http://localhost:3333/files/${image.path}`,
    };
  },

  renderMany(images: Image[]) {
    return images.map(image => this.render(image));
  },
};

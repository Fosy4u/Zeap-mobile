interface IBodyMeasurementGuide {
  _id: string;
  name: string;
  gender: string;
  fields: IField[];
  updatedAt: string;
  createdAt: string;
  __v: number;
}

interface IField {
  imageUrl: IImageUrl;
  field: string;
  description: string;
  _id: string;
}

interface IImageUrl {
  link: string;
  name: string;
}

export default IBodyMeasurementGuide;
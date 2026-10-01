// Body measurement guide — the canonical, shared model for the
// /bodyMeasurementGuide/bespoke?gender=… endpoint. Used by both the buyer
// (user) measurement flow and the vendor add-bespoke-product step 3, so it
// lives in the general module as the single source of truth.
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

export type { IField, IImageUrl };
export default IBodyMeasurementGuide;

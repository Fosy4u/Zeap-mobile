interface IPoint {
  _id: string;
  user: string;
  availablePoints: number;
  redeemedPoints: number;
  totalPoints: number;
  updatedAt: string;
  createdAt: string;
  __v: number;
}

export default IPoint;
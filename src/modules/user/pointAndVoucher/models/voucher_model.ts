interface IVoucher {
  _id: string;
  code: string;
  amount: number;
  expiryDate: string;
  isUsed: boolean;
  source: string;
  user: string;
  currency: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
};

export default IVoucher;
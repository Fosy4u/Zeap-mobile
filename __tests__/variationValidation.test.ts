import {describe, it, expect} from '@jest/globals';
import {
  stepFiveAddBespokeShoesSchema,
  stepFiveAddReadyMadeClothesSchema,
  stepFiveAddReadyMadeShoesSchema,
} from '../src/modules/vendor/products/validations/addProduct_validation';

const readyMade = (price: unknown, quantity: unknown) => ({
  productId: 'p1',
  variation: {colorValue: 'Black', size: 'M', price, quantity},
  currentStep: 5,
});
const bespoke = (price: unknown) => ({
  productId: 'p1',
  variation: {colorType: 'single', availableColors: ['Black'], price},
  currentStep: 5,
});
const messageFor = async (schema: any, value: any) => {
  try {
    await schema.validate(value);
    return 'ACCEPTED';
  } catch (error: any) {
    return error.message;
  }
};

describe.each([
  ['ready-made clothes / accessories', stepFiveAddReadyMadeClothesSchema],
  ['ready-made shoes', stepFiveAddReadyMadeShoesSchema],
])('%s variation rules', (_label, schema) => {
  it.each([
    [15000, 5],
    [15000.5, 1],
    [999999999999, 100000],
  ])('accepts price %p with quantity %p', async (price, quantity) => {
    expect(await messageFor(schema, readyMade(price, quantity))).toBe('ACCEPTED');
  });

  it.each([
    [0, 5, 'Please enter a valid price.'],
    [-10, 5, 'Price cannot be less than 0.'],
    [Number('abc'), 5, 'Please enter a valid price.'],
    [15000, 0, 'Please enter a valid quantity.'],
    [15000, -2, 'Quantity cannot be less than 0.'],
    [15000, 1.5, 'Quantity must be a whole number.'],
  ])('rejects price %p with quantity %p', async (price, quantity, message) => {
    expect(await messageFor(schema, readyMade(price, quantity))).toBe(message);
  });
});

describe('bespoke variation rules', () => {
  it('accepts a positive price', async () => {
    expect(await messageFor(stepFiveAddBespokeShoesSchema, bespoke(25000))).toBe('ACCEPTED');
  });

  it.each([
    [0, 'Please enter a valid price.'],
    [Number(''), 'Please enter a valid price.'],
    [-5, 'Price cannot be less than 0.'],
  ])('rejects price %p', async (price, message) => {
    expect(await messageFor(stepFiveAddBespokeShoesSchema, bespoke(price))).toBe(message);
  });
});

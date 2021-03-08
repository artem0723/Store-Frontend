import { CheckoutGetters} from '@vue-storefront/core';
import { ShippingMethod } from './../types/GraphQL';

export const getShippingMethodId = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? shippingMethod.id : '';

export const getShippingMethodName = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? shippingMethod.name : '';

export const getShippingMethodDescription = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? (shippingMethod as any).localizedDescription : '';

export const getShippingMethodPrice = (shippingMethod: ShippingMethod): number => {
  if (!shippingMethod || !shippingMethod.zoneRates) {
    return null;
  }

  return shippingMethod.zoneRates[0].shippingRates[0].price.centAmount / 100;
};

export const getFormattedPrice = (price: number) => price as any as string;

const checkoutGetters: CheckoutGetters<ShippingMethod> = {
  getShippingMethodId,
  getShippingMethodName,
  getShippingMethodDescription,
  getShippingMethodPrice,
  getFormattedPrice
};

export default checkoutGetters;

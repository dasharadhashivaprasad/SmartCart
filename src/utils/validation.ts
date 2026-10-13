export type DeliveryDetails = {
  name: string;
  address: string;
  city: string;
  postal: string;
};
export function isValidDeliveryDetails(details: DeliveryDetails): boolean {
  return Object.values(details).every(value => value.trim().length > 0);
}

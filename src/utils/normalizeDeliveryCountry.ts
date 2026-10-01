// The address dropdown and older saved addresses use short country keys, while
// checkout/payment endpoints validate the countries' canonical display names.
const CANONICAL_COUNTRIES: Record<string, string> = {
  nigeria: 'Nigeria',
  ng: 'Nigeria',
  'united states': 'United States',
  'united states of america': 'United States',
  usa: 'United States',
  us: 'United States',
  'united kingdom': 'United Kingdom',
  uk: 'United Kingdom',
  gb: 'United Kingdom',
  canada: 'Canada',
  ca: 'Canada',
};

export const normalizeDeliveryCountry = (country?: string): string => {
  const trimmedCountry = country?.trim() || '';
  return CANONICAL_COUNTRIES[trimmedCountry.toLowerCase()] || trimmedCountry;
};

export default normalizeDeliveryCountry;

import * as maps from '@google/maps';
import { Address } from '@shared/_interfaces/address.interface';
import { getConfig } from './../db';

export const getLocationMarker = async (address: Address): Promise<maps.GeocodingResult[] | undefined> => {
  const config = await getConfig();
  if (config.googleMapsKey) {
    const googleMapsClient = maps.createClient({ key: config.googleMapsKey, Promise });
    const addressString = address.streetName + ' ' + address.houseNumber + ' ' + address.city + ' ' + address.county;
    const googleResponse = await googleMapsClient.geocode({ address: addressString }).asPromise();
    return googleResponse.json.results;
  } else {
    return undefined;
  }
};

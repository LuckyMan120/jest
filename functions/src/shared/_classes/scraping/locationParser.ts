import { DocumentSnapshot } from '@google-cloud/firestore';
import { Location } from '@location/_interfaces/location.interface';
import * as admin from 'firebase-admin';

export class LocationParser {

  protected location: Location | undefined;
  protected fs = admin.firestore();

  constructor(
    public rawLocation: string
  ) {

    if (this.rawLocation && this.rawLocation !== '') {
      const rawArray = rawLocation.split(', ');
      const categoryName = rawArray.splice(0, 1)[0];
      const fullCounty = rawArray.splice(-1)[0];
      const street = rawArray.splice(-1)[0];
      rawArray.splice(-1)[0];
      const city = rawArray.join(' ');

      // const [categoryName, city, dummy1, street, fullCounty] = rawLocation.split(',');
      const [zip, ...countyArray] = fullCounty.trim().split(' ');
      const county = countyArray.join(' ');

      const streetArray = street.trim().split(' ');

      // ADDRESSES
      let houseNumber: string = streetArray.length > 1 ? streetArray.slice(-1)[0] : '';
      let streetName = street.trim().replace('str.', 'straße').replace('Str.', 'Straße');
      if (houseNumber === '' || isNaN(+houseNumber)) {
        houseNumber = '';
      } else {
        streetArray.splice(-1);
        streetName = streetArray.join(' ').replace('str.', 'straße').replace('Str.', 'Straße');
      }
      const timestamp = new Date().valueOf();
      this.location = {
        id: undefined,
        address: { city: city.trim(), zip: zip.trim(), county: county.trim(), streetName, houseNumber },
        galleries: { Profilfotos: { title: 'Profilfotos' } },
        isNew: true,
        assignedCategoryIds: [],
        assignedCategoryTitles: ['Platzarten', categoryName.trim()],
        title: `${categoryName.trim()} ${streetName}, ${city.trim()}`,
        creation: { at: timestamp, by: 'System - LocationParser' },
        modification: [{ at: timestamp, by: 'System - LocationParser', changes: ['NEW'] }],
        publication: { at: timestamp, by: 'System - LocationParser', status: 1 }
      };
    }
  }

  public async getLocation(): Promise<Location | undefined> {
    if (!this.location) {
      return undefined;
    }
    try {
      const result: Location | undefined = await this.findLocation();
      if (!result) {
        this.location = await this.parseRawLocation();

        const saveResult = await this.saveLocation();
        if (!saveResult) {
          throw new Error('Something went wrong when saving the new location');
        }

      } else {
        this.location = result;
      }
    } catch (e) {
      console.error(`[LocationParser.getLocation] - Error parsing/getting the location`, this.rawLocation, e);
      return undefined;
    }
    return this.location;
  }

  public async saveLocation(): Promise<Location | undefined> {
    if (!this.location) {
      throw new Error('[LocationParser.saveLocation] nothing to save');
    }
    try {
      if (!this.location.id) {
        this.location.id = this.fs.collection('locations').doc().id;
      }
      const _loc = this.location;
      delete _loc.isNew;
      await this.fs.doc(`locations/${this.location.id}`).set(_loc, { merge: true });

      return this.location;
    } catch (e) {
      console.error(`[LocationParser.LocationParser] - Error saving`, this.location, e);
      return undefined;
    }
  }

  protected async parseRawLocation(): Promise<Location | undefined> {
    if (this.location && this.location.assignedCategoryTitles) {
      for (const assignedCategoryTitle of this.location.assignedCategoryTitles) {
        const category = await this.findCategory(assignedCategoryTitle);
        if (!!category && this.location.assignedCategoryIds) {
          this.location.assignedCategoryIds.push(category.data()?.id);
        }
      }
      delete (this.location.assignedCategoryTitles);
    }
    return this.location || undefined;
  }

  protected async findLocation(): Promise<Location | undefined> {
    try {
      const locations = await this.fs.collection('locations').where('title', '==', this.location?.title).get();
      if (locations.size > 0) {
        return locations.docs[0].data() as Location;
      } else {
        return undefined;
      }
    } catch (e) {
      console.error('[LocationParser.findLocation]', this.location, e);
      return undefined;
    }
  }

  protected async findCategory(category: string): Promise<DocumentSnapshot | undefined> {
    try {
      const cats = await this.fs.collection('categories').where('parsingValues', 'array-contains', category).get();
      return cats.docs[0];
    } catch (e) {
      console.error('[LocationParser.findCategory]', category, e);
      return undefined;
    }
  }

}

import { Category } from '@category/_interfaces/category.interface';
import * as admin from 'firebase-admin';

export class MatchCategoryParser {
  protected fs = admin.firestore();

  constructor(protected playersType: string | undefined) { }

  public async getCategories(): Promise<{ id: string, title: string }[]> {

    const result: { id: string, title: string }[] = [];

    try {
      const docs = await this.fs.collection('categories').where('title', '==', this.playersType).limit(1).get();
      if (docs.docs.length > 0) {
        const cat1 = docs.docs[0].data() as Category;
        if (cat1.id && cat1.title) {
          result.push({ id: cat1.id, title: cat1.title });
        }

        if (cat1.assignedCategoryIds) {
          for (const id of cat1.assignedCategoryIds) {
            const assignedCategory = await this.fs.collection('categories').doc(id).get();
            result.push({ id: assignedCategory.id, title: assignedCategory.data()?.title });
          }
        }
      }
    } catch (e) {
      console.error('[MatchCategoryParser-getCategory] with playerType', this.playersType, e);
    }
    return result;
  }
}

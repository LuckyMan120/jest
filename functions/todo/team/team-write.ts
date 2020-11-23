/*
    if (!beforeData) {
      // set team-stats
      const statisticsToUpdate = {};
      for (const categoryId of afterData.assignedCategoryIds) {
        const category = await admin.firestore().doc(`categories/${categoryId}`).get();
        statisticsToUpdate[category.data().title] = admin.firestore.FieldValue.increment(1);
      }
      admin.firestore().collection(`statistics`).doc(`team-statistics`).set(statisticsToUpdate, { merge: true });

    } else {
      // update team-stats
      if (!_.isEqual(afterData.assignedCategoryIds, beforeData.assignedCategoryIds)) {
        const statistics = await admin.firestore().doc('statistics/team-statistics').get();
        const beforeTitleField = {};
        const afterTitleField = {};
        beforeTitleField[beforeData.title] = FieldValue.delete(); // delete entry with old title
        afterTitleField[afterData.title] = statistics.data()[beforeData.title];
        statistics.ref.set({ beforeTitleField, afterTitleField }, { merge: true });
      }
    }
 */

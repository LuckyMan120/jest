import { Player } from '@player/_interfaces/player.interface';
import admin = require('firebase-admin');

export const generatePlayerStats = async (now: string, force = false) => {

  const players = await admin.firestore().collection('players').get();

  // eslint-disable-next-line max-len
  const chartData: any = (await admin.firestore().collection('statistics').doc(`player-statistics`).get()).data() || { labels: [], data: {} };

  if (chartData.labels.includes(now) && !force) {
    throw new Error('Die Spielerstatistik für diesen Monat wurde bereits angelegt.');
  }

  chartData.labels.push(now);

  const list = players.docs.map(doc => (doc.data() as Player).ageGroup);

  const countByAgeGroup = list.reduce((acc: any, ageGroup: string) => {
    if (!acc[ageGroup]) {
      acc[ageGroup] = 1;
    } else {
      acc[ageGroup] += 1;
    }
    return acc;
  }, {});

  const data = Object.entries(countByAgeGroup).map(entry => ({ title: entry[0], acc: entry[1] }));
  console.log(data);

  // uniqueLabels.map(label => console.log(label));

  // chartData.data[now] = data;
  // console.log(chartData);
  // await admin.firestore().collection('statistics').doc(`player-statistics`).set(chartData, { merge: true });

  return chartData;
};

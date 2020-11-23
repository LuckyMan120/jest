import * as axios from 'axios';
import * as functions from 'firebase-functions';
import { isUserAllowedToCallFn } from './../../index';

export const callGetMailjetUserList = functions
	.region('europe-west1')
	.runWith({ memory: '1GB', timeoutSeconds: 90 })
	// .https.onRequest(async (req: functions.https.Request, resp: functions.Response) => {
	.https.onCall(async (data: any, context: functions.https.CallableContext) => {

		const isAllowed = await isUserAllowedToCallFn(context.auth?.uid, null);

		if (isAllowed) {

			try {
				const axiosResponse = await axios.default.get(`https://api.mailjet.com/v3/REST/contact`, {
					auth: {
						username: functions.config().mailjet.key,
						password: functions.config().mailjet.secret,
					},
					params: {
						Limit: 1000,
					}
				});

				return axiosResponse.data.Data ? axiosResponse.data.Data.filter((entry: any) => !entry.IsOptInPending) : []

			} catch (e) {
				return e;
			}

		}
	});

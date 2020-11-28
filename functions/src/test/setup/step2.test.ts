import * as admin from 'firebase-admin';
import functions from "firebase-functions-test";
import 'jest-extended';
import { fsUser, onUserAuthCreate } from '../../user/user-auth-create';
import { onUserCreate } from '../../user/user-create';
import { onUserDelete } from '../../user/user-delete';
import { afterData, onUserUpdate } from '../../user/user-update';


const projectId = 'sfw-test-db';
process.env.GCLOUD_PROJECT = projectId;
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

const testEnv = functions();

const mockSet = jest.fn();

mockSet.mockReturnValue(true);

jest.mock("firebase-admin", () => ({
  initializeApp: jest.fn(),
  database: () => ({
    ref: jest.fn(path => ({
      set: mockSet
    }))
  })
}));

it("should test `onUserCreate`", async () => {
  const wrapped = testEnv.wrap(onUserCreate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  const newUser = onUserCreate(testUser);

  // check our db set function is called with expected parameter
  expect(admin.database().ref(`/users/${testUser.uid}`).set).toBeCalledWith(newUser);

  // check it returns mocked value as expected
  expect(wrapped(testUser)).toBe(true);
});


it("should test 'onUserAuthCreate' on AdminUserID", async () => {

  const wrapped = testEnv.wrap(onUserAuthCreate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  const adminUserID = (await admin.firestore().collection('applications').doc('/${currentApplications.adminUserId}').get());

  // check it returns mocked value as expected
  expect(wrapped(adminUserID)).toBe(testUser.uid);

})

it("should test 'onUserAuthCreate' on isGodAdmin", async () => {

  const wrapped = testEnv.wrap(onUserAuthCreate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  const adminUserID = (await fsUser.isGodAdmin);

  // check it returns mocked value as expected
  expect(wrapped(adminUserID)).toBe(true);

})

it("should test 'onUserAuthCreate' on defaultRoleID", async () => {

  const wrapped = testEnv.wrap(onUserAuthCreate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  const adminInfo = (await admin.firestore().collection('users').doc('/${Auth.uid}').get());

  // check it returns mocked value as expected
  expect(wrapped(adminInfo)).toBe(testUser.uid);

})

it("should test 'onUserDelete' on Benutzer-Counter", async () => {

  const wrapped = testEnv.wrap(onUserAuthCreate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  const Benutzer = (await admin.firestore().collection('statistics').doc('/${currentApplications.Benutzer}').get());

  // check it returns mocked value as expected
  expect(wrapped(Benutzer)).toBe(1);

})

it("should test 'onUserDelete' on Role-Title", async () => {

  const wrapped = testEnv.wrap(onUserDelete);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  const statistics = (await admin.firestore().collection('roles').get());
  let query = statistics.docs;

  // check it returns mocked value as expected
  expect(query.toString().includes(testUser.uid)).toBe(-1);

})

it("should test 'onUserUpdate' on Email Verification", async () => {

  const wrapped = testEnv.wrap(onUserUpdate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  const statistics = (await admin.firestore().collection('roles').get());
  let query = statistics.docs;

  // check it returns mocked value as expected
  expect(query.toString().includes(testUser.uid)).toBe(-1);

})

it("should test 'onUserUpdate' on Email Verification", async () => {

  const wrapped = testEnv.wrap(onUserUpdate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  // check it returns mocked value as expected
  expect(afterData.emailVerified).toBe(false);

})

it("should test 'onUserUpdate' on Assigned Roles", async () => {

  const wrapped = testEnv.wrap(onUserUpdate);
  const testUser = {
    uid: "122",
    displayName: "lee"
  };

  await wrapped(testUser);

  // check it returns mocked value as expected
  expect(afterData.assignedRoles.toString().includes(testUser.uid)).toBe(-1);

})

import { currentApplication, getConfig } from '../db';
import { fun } from './test.config';
fun.cleanup;

it('should pass', () => {
  expect(true).toBe(true);
});

test('currentApp is initialized', () => {
  expect(currentApplication).toBeDefined();
});

test('config is initialized', () => {
  expect(getConfig).toBeDefined();
});



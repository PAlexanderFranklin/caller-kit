import { callModule, connectModule } from 'libkernel';
import { writable } from 'svelte/store';

const danceModule = 'AQDnT1ZRZO4zXffZAkqWJszR7GfRl1f4AlCde1Kti18c5w';

export const calls = writable([]);

export const createCall = async (call) => {
  const [result, err] = await callModule(danceModule, 'createCall', {call});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const subscribeCalls = async (update) => {
  //we won't handle sending updates to module, or dealing with closing response
  connectModule(danceModule, 'subscribeCalls', {}, update);
};
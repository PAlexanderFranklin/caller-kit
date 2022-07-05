import { callModule, connectModule } from 'libkernel';
import { writable } from 'svelte/store';

const danceModule = 'AQDnT1ZRZO4zXffZAkqWJszR7GfRl1f4AlCde1Kti18c5w';

export const calls = writable([]);

export const getCallById = async (id) => {
  const [result, err] = await callModule(danceModule, 'getCallById', {id});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const createCall = async (call) => {
  const [result, err] = await callModule(danceModule, 'createCall', {call});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const updateCall = async (call) => {
  const [result, err] = await callModule(danceModule, 'updateCall', {call});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const deleteCall = async (id) => {
  const [result, err] = await callModule(danceModule, 'deleteCall', {id});
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

export const dances = writable([]);

export const getDanceById = async (id) => {
  const [result, err] = await callModule(danceModule, 'getDanceById', {id});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const createDance = async (dance) => {
  const [result, err] = await callModule(danceModule, 'createDance', {dance});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const updateDance = async (dance) => {
  const [result, err] = await callModule(danceModule, 'updateDance', {dance});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const deleteDance = async (id) => {
  const [result, err] = await callModule(danceModule, 'deleteDance', {id});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const subscribeDances = async (update) => {
  //we won't handle sending updates to module, or dealing with closing response
  connectModule(danceModule, 'subscribeDances', {}, update);
};
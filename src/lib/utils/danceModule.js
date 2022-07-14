import { callModule, connectModule } from 'libkernel';
import { writable } from 'svelte/store';

const danceModule = 'AQDnT1ZRZO4zXffZAkqWJszR7GfRl1f4AlCde1Kti18c5w';

export const calls = writable([]);
export const dances = writable([]);

export const getState = async () => {
  const [result, err] = await callModule(danceModule, 'getState');
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const getCallByRef = async (call) => {
  const [result, err] = await callModule(danceModule, 'getCallByRef', {call});
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

export const getDanceByRef = async (dance) => {
  const [result, err] = await callModule(danceModule, 'getDanceByRef', {dance});
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
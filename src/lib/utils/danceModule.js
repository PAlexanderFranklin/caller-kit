import { callModule } from 'libkernel';
import { writable } from 'svelte/store';

const danceModule = 'AQDNxEqS_cO5Qqpy8VXBUBNsDHpRn6nh_RkdNNXX3opE4Q';

export const calls = writable([]);
export const dances = writable([]);
export const musicList = writable([]);

export const getState = async () => {
  const [result, err] = await callModule(danceModule, 'getState');
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

export const getCallByRef = async (call) => {
  const [result, err] = await callModule(danceModule, 'getCallByRef', {call});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const insertCall = async (call) => {
  const [result, err] = await callModule(danceModule, 'insertCall', {call});
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

export const shareCall = async (id) => {
  const [result, err] = await callModule(danceModule, 'shareCall', {id});
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

export const getDanceByRef = async (dance) => {
  const [result, err] = await callModule(danceModule, 'getDanceByRef', {dance});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const insertDance = async (dance) => {
  const [result, err] = await callModule(danceModule, 'insertDance', {dance});
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

export const shareDance = async (id) => {
  const [result, err] = await callModule(danceModule, 'shareDance', {id});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const createMusic = async (music) => {
  const [result, err] = await callModule(danceModule, 'createMusic', {music});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const getMusicByRef = async (music) => {
  const [result, err] = await callModule(danceModule, 'getMusicByRef', {music});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const insertMusic = async (music) => {
  const [result, err] = await callModule(danceModule, 'insertMusic', {music});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const updateMusic = async (music) => {
  const [result, err] = await callModule(danceModule, 'updateMusic', {music});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const deleteMusic = async (id) => {
  const [result, err] = await callModule(danceModule, 'deleteMusic', {id});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}

export const shareMusic = async (id) => {
  const [result, err] = await callModule(danceModule, 'shareMusic', {id});
  if (err) {
    throw err;
  }
  else {
    return result;
  }
}
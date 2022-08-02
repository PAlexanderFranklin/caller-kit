import { FeedDAC } from "skynet-dacs-library";
import { getCallByRef, updateCall, getDanceByRef, updateDance, getMusicByRef, updateMusic } from "./danceModule";

const feedDAC = new FeedDAC();

export const shareCall = async (callRef) => {
  if (!callRef.id) {
    throw "attempted to share call with no id";
  }

  const res = await getCallByRef(callRef);
  let sharedCall = res.call;

  // if call to share not found, error.
  if (!sharedCall) {
    throw `call with id ${callRef.id} not found.`
  }

  // If no skyfeed address was given but one is found, return the found reference.
  if (!callRef.skyfeed && sharedCall.skyfeed) {
    return {
      ...callRef,
      skyfeed: sharedCall.skyfeed,
    }
  }

  // ensure all dependency calls are shared, and update their references in the call to contain the skyfeed URI
  if (sharedCall.footwork && !sharedCall.footwork.skyfeed) {
    sharedCall.footwork = await shareCall(sharedCall.footwork);
  }
  if (sharedCall.hold && !sharedCall.hold.skyfeed) {
    sharedCall.hold = await shareCall(sharedCall.hold);
  }

  // Upload
  const skyfeedURI = await feedDAC.createPost({
    title: sharedCall.title,
    ext: {
      danceCall: {...sharedCall}
    }
  }, "danceCalls");
  sharedCall.skyfeed = skyfeedURI;
  callRef.skyfeed = skyfeedURI;

  await updateCall(sharedCall);
  return callRef;
}

export const shareDance = async (danceRef) => {
  if (!danceRef.id) {
    throw "attempted to share dance with no id";
  }

  const res = await getDanceByRef(danceRef);
  let sharedDance = res.dance;

  // if dance to share not found, error.
  if (!sharedDance) {
    throw `dance with id ${danceRef.id} not found.`
  }

  // If no skyfeed address was given but one is found, return the found reference.
  if (!danceRef.skyfeed && sharedDance.skyfeed) {
    return {
      ...danceRef,
      skyfeed: sharedDance.skyfeed,
    }
  }

  // ensure all used calls are shared, and update their references in the dance to contain the skyfeed URI
  sharedDance.instructions = await sharedDance.instructions.reduce(async (previous, group) => {
    const result = await previous;
    return [...result, await group.reduce(async (previous, call) => {
      const result = await previous;
      console.log(result);
      if (call.skyfeed) {
        return [...result, call];
      }
      else {
        return [...result, await shareCall(call)];
      }
    }, new Promise((resolve) => resolve([])))]
  }, new Promise((resolve) => resolve([])))
  if (sharedDance.footwork && !sharedDance.footwork.skyfeed) {
    sharedDance.footwork = await shareCall(sharedDance.footwork);
  }
  if (sharedDance.hold && !sharedDance.hold.skyfeed) {
    sharedDance.hold = await shareCall(sharedDance.hold);
  }

  if (sharedDance.music) {
    // ensure all used music is shared, and update references in the dance to contain skyfeed URIs
    sharedDance.music = await sharedDance.music.reduce(async (previous, music) => {
      const result = await previous;
      if (music.skyfeed) {
        return [...result, music];
      }
      else {
        return [...result, await shareMusic(music)];
      }
    }, new Promise((resolve) => resolve([])))
  }

  // Upload
  const skyfeedURI = await feedDAC.createPost({
    title: sharedDance.title,
    ext: {
      dance: {...sharedDance}
    }
  }, "dances");
  sharedDance.skyfeed = skyfeedURI;
  danceRef.skyfeed = skyfeedURI;

  await updateDance(sharedDance);
  return danceRef;
}

export const shareMusic = async (musicRef) => {
  if (!musicRef.id) {
    throw "attempted to share music with no id";
  }

  const res = await getMusicByRef(musicRef);
  let sharedMusic = res.music;

  // if music to share not found, error.
  if (!sharedMusic) {
    throw `music with id ${musicRef.id} not found.`
  }

  // If no skyfeed address was given but one is found, return the found reference.
  if (!musicRef.skyfeed && sharedMusic.skyfeed) {
    return {
      ...musicRef,
      skyfeed: sharedMusic.skyfeed,
    }
  }

  // Upload
  const skyfeedURI = await feedDAC.createPost({
    title: sharedMusic.title,
    ext: {
      danceMusic: {...sharedMusic}
    }
  }, "danceMusic");
  sharedMusic.skyfeed = skyfeedURI;
  musicRef.skyfeed = skyfeedURI;

  await updateMusic(sharedMusic);
  return musicRef;
}
import { addHandler, handleMessage, log } from 'libkmodule';
import {v4 as uuid} from 'uuid';
import type { activeQuery } from 'libkmodule';
import type { Call, CallRef, Dancer, Formation, Dance } from './danceTypes';

// Sets up managing postMessage handling.
onmessage = handleMessage;

let calls: Array<Call> = [];
let dances: Array<Dance> = [];
let formations: Array<Formation> = [];

const setCalls = (newCalls: Array<Call>) => {
  calls = newCalls;
}

const setDances = (newDances: Array<Dance>) => {
  dances = newDances;
}

const setFormations = (newFormations: Array<Formation>) => {
  formations = newFormations;
}

const createCall = (aq: activeQuery) => {
  const newCall:Call = {
    id: uuid(),
    title: aq.callerInput.call?.title,
    text: aq.callerInput.call?.text,
    beats: aq.callerInput.call?.beats
  };
  setCalls([...calls, newCall])
}

addHandler('createCall', createCall);
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

const handleGetCalls = (aq: activeQuery) => {
  aq.respond({calls});
}

const setDances = (newDances: Array<Dance>) => {
  dances = newDances;
}

const setFormations = (newFormations: Array<Formation>) => {
  formations = newFormations;
}

const handleDeleteCall = (aq: activeQuery) => {
  if (typeof aq.callerInput?.id === 'string') {
    // create list of just removed call.
    const removedCall = calls.filter(({ id }) => {
      return id === aq.callerInput.id;
    });

    // if call to remove found, update state, otherwise reject.
    if (removedCall.length) {
      const remainingCalls = calls.filter(({ id }) => {
        return id !== aq.callerInput.id;
      });
      setCalls(remainingCalls);

      aq.respond({ call: removedCall[0] });
    } else {
      aq.reject(`No call found with id ${aq.callerInput.id}`);
    }
  } else {
    // return an error if no id included in callerInput data
    aq.reject('deleteCall requires field `id`.');
  }
};

const handleCreateCall = (aq: activeQuery) => {
  if ('call' in aq.callerInput) {
    const call:any = aq.callerInput.call
    if (!call.title) {
      aq.reject('No title found, call not created.');
      return
    }
    const newCall:Call = {
      id: uuid(),
      title: call.title,
      text: call.text,
      beats: call.beats,
      license: call.license || "CC0",
      dependencies: call.dependencies,
      footwork: call.footwork,
      hold: call.hold,
    };
    setCalls([...calls, newCall]);
    aq.respond({call: newCall});
  }
  else {
    aq.reject('callerinput.call must be defined for "createCall"');
  }
}

addHandler('createCall', handleCreateCall);
addHandler('getCalls', handleGetCalls)
addHandler('deleteCall', handleDeleteCall)
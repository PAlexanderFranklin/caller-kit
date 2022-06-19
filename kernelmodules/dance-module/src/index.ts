import { addHandler, handleMessage, log } from 'libkmodule';
import {v4 as uuid} from 'uuid';
import type { activeQuery } from 'libkmodule';
import type { Call, CallRef, Dancer, Formation, Dance } from './danceTypes';

// Sets up managing postMessage handling.
onmessage = handleMessage;

// Initialize array to hold `setUpdate` functions, one for each subscribed caller
let subscriptionUpdatesCalls: Array<(updateData: any) => void> = [];

let calls: Array<Call> = [];
let dances: Array<Dance> = [];
let formations: Array<Formation> = [];

const setCalls = (newCalls: Array<Call>) => {
  calls = newCalls;
  pushCalls();
}

const handleGetCalls = (aq: activeQuery) => {
  aq.respond({calls});
}

const pushCalls = () => {
  // for each sendUpdate function, send latest list
  subscriptionUpdatesCalls.forEach((sendUpdate) => {
    sendUpdate({ calls });
  });
};

const handleSubscribeCalls = (aq: activeQuery) => {
  // add sendUpdate method to list of subscriptions
  subscriptionUpdatesCalls.push(aq.sendUpdate);

  // do initial responseUpdate for this caller
  aq.sendUpdate({ calls });
};

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
      ...call,
      id: uuid(),
      license: call.license || "CC0",
    };
    setCalls([...calls, newCall]);
    aq.respond({call: newCall});
  }
  else {
    aq.reject('callerinput.call must be defined for "createCall"');
  }
}

const setDances = (newDances: Array<Dance>) => {
  dances = newDances;
}

const setFormations = (newFormations: Array<Formation>) => {
  formations = newFormations;
}

addHandler('createCall', handleCreateCall);
addHandler('getCalls', handleGetCalls)
addHandler('subscribeCalls', handleSubscribeCalls)
addHandler('deleteCall', handleDeleteCall)
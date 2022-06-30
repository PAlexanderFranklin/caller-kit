import { addHandler, handleMessage, log } from 'libkmodule';
import {v4 as uuid} from 'uuid';
import type { activeQuery } from 'libkmodule';
import type { Call, CallRef, Dancer, Formation, Dance } from './danceTypes';

// Sets up managing postMessage handling.
onmessage = handleMessage;

// Initialize array to hold `setUpdate` functions, one for each subscribed caller
let subscriptionUpdatesCalls: Array<(updateData: any) => void> = [];
let subscriptionUpdatesDances: Array<(updateData: any) => void> = [];

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

const handleGetCallById = (aq: activeQuery) => {
  if (typeof aq.callerInput?.id === 'string') {
    // create list of just the requested call.
    const matchedCall = calls.filter(({ id }) => {
      return id === aq.callerInput.id;
    });

    if (matchedCall.length) {
      aq.respond({ call: matchedCall[0] });
    } else {
      aq.reject(`No call found with id ${aq.callerInput.id}`);
    }
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getCallById requires field `id`.');
  }
};

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
  pushDances();
}

const handleGetDances = (aq: activeQuery) => {
  aq.respond({dances});
}

const handleGetDanceById = (aq: activeQuery) => {
  if (typeof aq.callerInput?.id === 'string') {
    // create list of just the requested dance.
    const matchedDance = dances.filter(({ id }) => {
      return id === aq.callerInput.id;
    });

    if (matchedDance.length) {
      aq.respond({ dance: matchedDance[0] });
    } else {
      aq.reject(`No dance found with id ${aq.callerInput.id}`);
    }
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getDanceById requires field `id`.');
  }
};

const pushDances = () => {
  // for each sendUpdate function, send latest list
  subscriptionUpdatesDances.forEach((sendUpdate) => {
    sendUpdate({ dances });
  });
};

const handleSubscribeDances = (aq: activeQuery) => {
  // add sendUpdate method to list of subscriptions
  subscriptionUpdatesDances.push(aq.sendUpdate);

  // do initial responseUpdate for this caller
  aq.sendUpdate({ dances });
};

const handleDeleteDance = (aq: activeQuery) => {
  if (typeof aq.callerInput?.id === 'string') {
    // create list of just removed dance.
    const removedDance = dances.filter(({ id }) => {
      return id === aq.callerInput.id;
    });

    // if dance to remove found, update state, otherwise reject.
    if (removedDance.length) {
      const remainingDances = dances.filter(({ id }) => {
        return id !== aq.callerInput.id;
      });
      setDances(remainingDances);

      aq.respond({ dance: removedDance[0] });
    } else {
      aq.reject(`No dance found with id ${aq.callerInput.id}`);
    }
  } else {
    // return an error if no id included in callerInput data
    aq.reject('deleteDance requires field `id`.');
  }
};

const handleCreateDance = (aq: activeQuery) => {
  if ('dance' in aq.callerInput) {
    const dance:any = aq.callerInput.dance
    if (!dance.title) {
      aq.reject('No title found, dance not created.');
      return
    }
    const newDance:Dance = {
      ...dance,
      id: uuid(),
      license: dance.license || "CC0",
    };
    setDances([...dances, newDance]);
    aq.respond({dance: newDance});
  }
  else {
    aq.reject('callerinput.dance must be defined for "createDance"');
  }
}

const setFormations = (newFormations: Array<Formation>) => {
  formations = newFormations;
}

addHandler('createCall', handleCreateCall);
addHandler('getCalls', handleGetCalls)
addHandler('getCallById', handleGetCallById)
addHandler('subscribeCalls', handleSubscribeCalls)
addHandler('deleteCall', handleDeleteCall)

addHandler('createDance', handleCreateDance);
addHandler('getDances', handleGetDances)
addHandler('getDanceById', handleGetDanceById)
addHandler('subscribeDances', handleSubscribeDances)
addHandler('deleteDance', handleDeleteDance)
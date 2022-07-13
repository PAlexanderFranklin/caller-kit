import { addHandler, handleMessage, log, createIndependentFileSmall, getSeed, ERR_NOT_EXISTS} from 'libkmodule';
import {v4 as uuid} from 'uuid';
import type { ActiveQuery } from 'libkmodule';
import type { Call, CallRef, Dancer, Formation, Dance } from './danceTypes';

import {jsonToArray, arrayToJson, openFile, readData} from './helpers';

// Sets up managing postMessage handling.
onmessage = handleMessage;

let moduleSeed: Uint8Array;
let moduleDataFile: any;

let calls: Array<Call> = [];
let dances: Array<Dance> = [];

const initializeModule = async () => {
  if(!moduleDataFile) {
    moduleSeed = await getSeed();
    try {
      moduleDataFile = await openFile(moduleSeed, "moduleData");
      ({calls, dances} = await readData(moduleDataFile));
      return moduleDataFile;
    } catch (error) {
      if (error === ERR_NOT_EXISTS) {
        let dataFile = jsonToArray({calls, dances});
        let [res, error] = await createIndependentFileSmall(moduleSeed, "moduleData", dataFile);
        if (error) {
          throw error;
        }
        moduleDataFile = res;
        return moduleDataFile;
      }
      else {
        throw error;
      }
    }
  }
}

const setState = async () => {
  return await moduleDataFile.overwriteData(jsonToArray({calls, dances}));
}

const setCalls = async (newCalls: Array<Call>) => {
  calls = newCalls;
  return await setState();
}

const handleGetState = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    aq.respond({calls, dances});
  });
}

const handleGetCallByRef = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if (typeof aq.callerInput?.call?.id === 'string') {
      // create list of just the requested call.
      const matchedCall = calls.filter(({ id }) => {
        return id === aq.callerInput.call.id;
      });

      if (matchedCall.length) {
        aq.respond({ call: matchedCall[0] });
      } else {
        aq.reject(`No call found with id ${aq.callerInput.call.id}`);
      }
    } else {
      // return an error if no id included in callerInput data
      aq.reject('getCallByRef requires field `id`.');
    }
  });
};

const handleCreateCall = (aq: ActiveQuery) => {
  initializeModule().then(() => {
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
        modifiedAt: new Date(),
      };
      setCalls([...calls, newCall]).then(() => {
        aq.respond({call: newCall});
      })
    }
    else {
      aq.reject('callerinput.call must be defined for "createCall"');
    }
  });
}

const handleUpdateCall = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('call' in aq.callerInput) {
      const updatedCall:Call = {
        ...aq.callerInput.call,
        modifiedAt: new Date(),
      };
      if (!updatedCall.title) {
        aq.reject('No title found, call not updated.');
        return
      }
      if (typeof updatedCall.id === 'string') {
        // create list of just call to update.
        const callToUpdate = calls.filter(({ id }) => {
          return id === updatedCall.id;
        });

        // if call to update found, update state, otherwise reject.
        if (callToUpdate.length) {
          const remainingCalls = calls.filter(({ id }) => {
            return id !== updatedCall.id;
          });
          setCalls([...remainingCalls, updatedCall]).then(() => {
            aq.respond({call: callToUpdate[0]});
          })
        } else {
          aq.reject(`No call found with id ${updatedCall.id}`);
        }
      } else {
        // return an error if no id included in callerInput data
        aq.reject('updateCall requires field `call` with property `id`.');
      }
    }
    else {
      aq.reject('callerinput.call must be defined for "updateCall"');
    }
  });
};

const handleDeleteCall = (aq: ActiveQuery) => {
  initializeModule().then(() => {
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
        setCalls(remainingCalls).then(() => {
          aq.respond({ call: removedCall[0] });
        })
      } else {
        aq.reject(`No call found with id ${aq.callerInput.id}`);
      }
    } else {
      // return an error if no id included in callerInput data
      aq.reject('deleteCall requires field `id`.');
    }
  });
};

const setDances = async (newDances: Array<Dance>) => {
  dances = newDances;
  return await setState();
}

const handleGetDanceByRef = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if (typeof aq.callerInput?.dance?.id === 'string') {
      // create list of just the requested dance.
      const matchedDance = dances.filter(({ id }) => {
        return id === aq.callerInput.dance.id;
      });

      if (matchedDance.length) {
        aq.respond({ dance: matchedDance[0] });
      } else {
        aq.reject(`No dance found with id ${aq.callerInput.dance.id}`);
      }
    } else {
      // return an error if no id included in callerInput data
      aq.reject('getDanceByRef requires field `id`.');
    }
  });
};

const handleCreateDance = (aq: ActiveQuery) => {
  initializeModule().then(() => {
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
        modifiedAt: new Date(),
      };
      setDances([...dances, newDance]).then(() => {
        aq.respond({dance: newDance});
      })
    }
    else {
      aq.reject('callerinput.dance must be defined for "createDance"');
    }
  });
}

const handleUpdateDance = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('dance' in aq.callerInput) {
      const updatedDance:Dance = {
        ...aq.callerInput.dance,
        modifiedAt: new Date(),
      };
      if (!updatedDance.title) {
        aq.reject('No title found, dance not updated.');
        return
      }
      if (typeof updatedDance.id === 'string') {
        // create list of just dance to update.
        const danceToUpdate = dances.filter(({ id }) => {
          return id === updatedDance.id;
        });

        // if dance to update found, update state, otherwise reject.
        if (danceToUpdate.length) {
          const remainingDances = dances.filter(({ id }) => {
            return id !== updatedDance.id;
          });
          setDances([...remainingDances, updatedDance]).then(() => {
            aq.respond({ dance: danceToUpdate[0] });
          })
        } else {
          aq.reject(`No dance found with id ${updatedDance.id}`);
        }
      } else {
        // return an error if no id included in callerInput data
        aq.reject('updateDance requires field `dance` with property `id`.');
      }
    }
    else {
      aq.reject('callerinput.dance must be defined for "updateDance"');
    }
  });
};

const handleDeleteDance = (aq: ActiveQuery) => {
  initializeModule().then(() => {
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
        setDances(remainingDances).then(() => {
          aq.respond({ dance: removedDance[0] });
        })
      } else {
        aq.reject(`No dance found with id ${aq.callerInput.id}`);
      }
    } else {
      // return an error if no id included in callerInput data
      aq.reject('deleteDance requires field `id`.');
    }
  });
};

addHandler('getState', handleGetState)

addHandler('createCall', handleCreateCall);
addHandler('getCallByRef', handleGetCallByRef)
addHandler('updateCall', handleUpdateCall)
addHandler('deleteCall', handleDeleteCall)

addHandler('createDance', handleCreateDance);
addHandler('getDanceByRef', handleGetDanceByRef)
addHandler('updateDance', handleUpdateDance)
addHandler('deleteDance', handleDeleteDance)
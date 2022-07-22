import { addHandler, handleMessage, log, createIndependentFileSmall, getSeed, ERR_NOT_EXISTS} from 'libkmodule';
import {v4 as uuid} from 'uuid';
import type { ActiveQuery } from 'libkmodule';
import type { Call, Dancer, Formation, Dance, Music } from './danceTypes';

import {jsonToArray, arrayToJson, openFile, readData} from './helpers';

// Sets up managing postMessage handling.
onmessage = handleMessage;

let moduleSeed: Uint8Array;
let moduleDataFile: any;

let calls: Array<Call> = [];
let dances: Array<Dance> = [];
let musicList: Array<Music> = [];

const initializeModule = async () => {
  if(!moduleDataFile) {
    moduleSeed = await getSeed();
    try {
      moduleDataFile = await openFile(moduleSeed, "moduleData");
      ({calls, dances, musicList} = await readData(moduleDataFile));
      if (!calls) {
        calls = [];
      }
      if (!dances) {
        dances = [];
      }
      if (!musicList) {
        musicList = [];
      }
      return moduleDataFile;
    } catch (error) {
      if (error === ERR_NOT_EXISTS) {
        let dataFile = jsonToArray({calls, dances, musicList});
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
  return await moduleDataFile.overwriteData(jsonToArray({calls, dances, musicList}));
}

const setCalls = async (newCalls: Array<Call>) => {
  calls = newCalls;
  return await setState();
}

const handleGetState = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    aq.respond({calls, dances, musicList});
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
        aq.respond({call: newCall, calls});
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
            aq.respond({call: callToUpdate[0], calls});
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
          aq.respond({ call: removedCall[0], calls });
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
      if (!dance.instructions) {
        aq.reject('No instructions found, dance not created.');
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
      if (!updatedDance.instructions) {
        aq.reject('No instructions found, dance not updated.');
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
            aq.respond({ dance: danceToUpdate[0], dances });
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
          aq.respond({ dance: removedDance[0], dances });
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

const setMusicList = async (newMusicList: Array<Music>) => {
  musicList = newMusicList;
  return await setState();
}

const handleGetMusicByRef = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if (typeof aq.callerInput?.music?.id === 'string') {
      // create list of just the requested music.
      const matchedMusic = musicList.filter(({ id }) => {
        return id === aq.callerInput.music.id;
      });

      if (matchedMusic.length) {
        aq.respond({ music: matchedMusic[0] });
      } else {
        aq.reject(`No music found with id ${aq.callerInput.music.id}`);
      }
    } else {
      // return an error if no id included in callerInput data
      aq.reject('getMusicByRef requires field `id`.');
    }
  });
};

const handleCreateMusic = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('music' in aq.callerInput) {
      const music:any = aq.callerInput.music
      if (!music.link) {
        aq.reject('No link found, music not created.');
        return
      }
      const newMusic:Music = {
        ...music,
        id: uuid(),
        modifiedAt: new Date(),
      };
      setMusicList([...musicList, newMusic]).then(() => {
        aq.respond({music: newMusic});
      })
    }
    else {
      aq.reject('callerinput.music must be defined for "createMusic"');
    }
  });
}

const handleUpdateMusic = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('music' in aq.callerInput) {
      const updatedMusic:Music = {
        ...aq.callerInput.music,
        modifiedAt: new Date(),
      };
      if (!updatedMusic.link) {
        aq.reject('No link found, music not created.');
        return
      }
      if (typeof updatedMusic.id === 'string') {
        // create list of just music to update.
        const musicToUpdate = musicList.filter(({ id }) => {
          return id === updatedMusic.id;
        });

        // if music to update found, update state, otherwise reject.
        if (musicToUpdate.length) {
          const remainingMusicList = musicList.filter(({ id }) => {
            return id !== updatedMusic.id;
          });
          setMusicList([...remainingMusicList, updatedMusic]).then(() => {
            aq.respond({ music: musicToUpdate[0], musicList });
          })
        } else {
          aq.reject(`No music found with id ${updatedMusic.id}`);
        }
      } else {
        // return an error if no id included in callerInput data
        aq.reject('updateMusic requires field `music` with property `id`.');
      }
    }
    else {
      aq.reject('callerinput.music must be defined for "updateMusic"');
    }
  });
};

const handleDeleteMusic = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if (typeof aq.callerInput?.id === 'string') {
      // create list of just removed music.
      const removedMusic = musicList.filter(({ id }) => {
        return id === aq.callerInput.id;
      });

      // if music to remove found, update state, otherwise reject.
      if (removedMusic.length) {
        const remainingMusicList = musicList.filter(({ id }) => {
          return id !== aq.callerInput.id;
        });
        setMusicList(remainingMusicList).then(() => {
          aq.respond({ music: removedMusic[0], musicList });
        })
      } else {
        aq.reject(`No music found with id ${aq.callerInput.id}`);
      }
    } else {
      // return an error if no id included in callerInput data
      aq.reject('deleteMusic requires field `id`.');
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

addHandler('createMusic', handleCreateMusic);
addHandler('getMusicByRef', handleGetMusicByRef)
addHandler('updateMusic', handleUpdateMusic)
addHandler('deleteMusic', handleDeleteMusic)
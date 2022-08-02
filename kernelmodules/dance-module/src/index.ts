import { addHandler, handleMessage, log, createIndependentFileSmall, getSeed, ERR_NOT_EXISTS} from 'libkmodule';
import { v4 as uuid } from 'uuid';
import { jsonToArray, arrayToJson, openFile, readData } from './helpers';
import * as myFeedDac from './feedDAC';

import type { ActiveQuery } from 'libkmodule';
import type { Call, CallRef, Dancer, Formation, Dance, DanceRef, Music, MusicRef } from './danceTypes';

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
  if (typeof aq.callerInput?.call?.id === 'string') {
    if (aq.callerInput.call.skyfeed) {
      myFeedDac.loadPost(aq.callerInput.call.skyfeed).then((post) => {
        const retrievedData = post.content?.ext?.danceCall;
        if (retrievedData) {
          aq.respond({call: {...retrievedData, skyfeed: aq.callerInput.call.skyfeed}});
        }
        else {
          throw "Feed data retrieved does not contain the right fields."
        }
      }).catch((err) => {
        aq.reject(err);
      })
    }
    else {
      initializeModule().then(() => {
          // create list of just the requested call.
          const matchedCall = calls.filter(({ id }) => {
            return id === aq.callerInput.call.id;
          });

          if (matchedCall.length) {
            aq.respond({ call: matchedCall[0] });
          } else {
            aq.reject(`No call found with id ${aq.callerInput.call.id}`);
          }
      });
    }
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getCallByRef requires field `id`.');
  }
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

/**
 * The caller of this function is responsible for setting state!
 */
const shareCall = async (callRef: any, aq: ActiveQuery) => {
  if (!callRef.id) {
    throw "attempted to share call with no id";
  }

  let sharedCall = calls.find(({ id }) => {
    return id === callRef.id;
  });

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
    sharedCall.footwork = await shareCall(sharedCall.footwork, aq);
  }
  if (sharedCall.hold && !sharedCall.hold.skyfeed) {
    sharedCall.hold = await shareCall(sharedCall.hold, aq);
  }

  // Upload
  const skyfeedURI = await myFeedDac.createPost({
    title: sharedCall.title,
    ext: {
      danceCall: {...sharedCall}
    }
  }, "danceCalls");
  sharedCall.skyfeed = skyfeedURI;
  callRef.skyfeed = skyfeedURI;

  calls = [...calls, sharedCall];
  setState();
  aq.sendUpdate({callRef});
  return callRef;
}

const handleShareCall = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if (typeof aq.callerInput?.id === 'string') {
      shareCall({id: aq.callerInput?.id}, aq).then((callRef) => {
        aq.respond({callRef})
      }).catch((err) => {
        aq.reject(err)
      });
    } else {
      // return an error if no id included in callerInput data
      aq.reject('shareCall requires field `id`.');
    }
  });
};

const setDances = async (newDances: Array<Dance>) => {
  dances = newDances;
  return await setState();
}

const handleGetDanceByRef = (aq: ActiveQuery) => {
  if (typeof aq.callerInput?.dance?.id === 'string') {
    if (aq.callerInput.dance.skyfeed) {
      myFeedDac.loadPost(aq.callerInput.dance.skyfeed).then((post) => {
        const retrievedData = post.content?.ext?.dance;
        if (retrievedData) {
          aq.respond({dance: {...retrievedData, skyfeed: aq.callerInput.dance.skyfeed}});
        }
        else {
          throw "Feed data retrieved does not contain the right fields."
        }
      }).catch((err) => {
        aq.reject(err);
      })
    }
    else {
      initializeModule().then(() => {
        // create list of just the requested dance.
        const matchedDance = dances.filter(({ id }) => {
          return id === aq.callerInput.dance.id;
        });

        if (matchedDance.length) {
          aq.respond({ dance: matchedDance[0] });
        } else {
          aq.reject(`No dance found with id ${aq.callerInput.dance.id}`);
        }
      });
    }
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getDanceByRef requires field `id`.');
  }
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

/**
 * The caller of this function is responsible for setting state!
 */
const shareDance = async (danceRef: any, aq: ActiveQuery) => {
  if (!danceRef.id) {
    throw "attempted to share dance with no id";
  }

  let sharedDance = dances.find(({ id }) => {
    return id === danceRef.id;
  });

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
  sharedDance.instructions = await sharedDance.instructions.reduce<Promise<any>>(async (previous, group) => {
    const result = await previous;
    return [...result, await group.reduce<Promise<any>>(async (previous, call) => {
      const result = await previous;
      if (call.skyfeed) {
        return [...result, call];
      }
      else {
        return [...result, await shareCall(call, aq)];
      }
    }, new Promise((resolve) => resolve([])))]
  }, new Promise((resolve) => resolve([])))
  if (sharedDance.footwork && !sharedDance.footwork.skyfeed) {
    sharedDance.footwork = await shareCall(sharedDance.footwork, aq);
  }
  if (sharedDance.hold && !sharedDance.hold.skyfeed) {
    sharedDance.hold = await shareCall(sharedDance.hold, aq);
  }

  if (sharedDance.music) {
    // ensure all used music is shared, and update references in the dance to contain skyfeed URIs
    sharedDance.music = await sharedDance.music.reduce<Promise<any>>(async (previous, music) => {
      const result = await previous;
      if (music.skyfeed) {
        return [...result, music];
      }
      else {
        return [...result, await shareMusic(music, aq)];
      }
    }, new Promise((resolve) => resolve([])))
  }

  // Upload
  const skyfeedURI = await myFeedDac.createPost({
    title: sharedDance.title,
    ext: {
      dance: {...sharedDance}
    }
  }, "dances");
  sharedDance.skyfeed = skyfeedURI;
  danceRef.skyfeed = skyfeedURI;

  dances = [...dances, sharedDance];
  setState();
  aq.sendUpdate({danceRef});
  return danceRef;
}

const handleShareDance = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if (typeof aq.callerInput?.id === 'string') {
      shareDance({id: aq.callerInput?.id}, aq).then((danceRef) => {
        aq.respond({danceRef})
      }).catch((err) => {
        aq.reject(err)
      });
    } else {
      // return an error if no id included in callerInput data
      aq.reject('shareDance requires field `id`.');
    }
  });
};

const setMusicList = async (newMusicList: Array<Music>) => {
  musicList = newMusicList;
  return await setState();
}

const handleGetMusicByRef = (aq: ActiveQuery) => {
  if (typeof aq.callerInput?.music?.id === 'string') {
    if (aq.callerInput.music.skyfeed) {
      myFeedDac.loadPost(aq.callerInput.music.skyfeed).then((post) => {
        const retrievedData = post.content?.ext?.danceMusic;
        if (retrievedData) {
          aq.respond({music: {...retrievedData, skyfeed: aq.callerInput.music.skyfeed}});
        }
        else {
          throw "Feed data retrieved does not contain the right fields."
        }
      }).catch((err) => {
        aq.reject(err);
      })
    }
    else {
      initializeModule().then(() => {
        // create list of just the requested music.
        const matchedMusic = musicList.filter(({ id }) => {
          return id === aq.callerInput.music.id;
        });

        if (matchedMusic.length) {
          aq.respond({ music: matchedMusic[0] });
        } else {
          aq.reject(`No music found with id ${aq.callerInput.music.id}`);
        }
      });
    }
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getMusicByRef requires field `id`.');
  }
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

/**
 * The caller of this function is responsible for setting state!
 */
const shareMusic = async (musicRef: any, aq: ActiveQuery) => {
  if (!musicRef.id) {
    throw "attempted to share music with no id";
  }

  let sharedMusic = musicList.find(({ id }) => {
    return id === musicRef.id;
  });

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
  const skyfeedURI = await myFeedDac.createPost({
    title: sharedMusic.title,
    ext: {
      danceMusic: {...sharedMusic}
    }
  }, "danceMusic");
  sharedMusic.skyfeed = skyfeedURI;
  musicRef.skyfeed = skyfeedURI;

  musicList = [...musicList, sharedMusic];
  setState();
  aq.sendUpdate({musicRef});
  return musicRef;
}

const handleShareMusic = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if (typeof aq.callerInput?.id === 'string') {
      shareMusic({id: aq.callerInput?.id}, aq).then((musicRef) => {
        aq.respond({musicRef})
      }).catch((err) => {
        aq.reject(err)
      });
    } else {
      // return an error if no id included in callerInput data
      aq.reject('shareMusic requires field `id`.');
    }
  });
};

addHandler('getState', handleGetState)

addHandler('createCall', handleCreateCall);
addHandler('getCallByRef', handleGetCallByRef)
addHandler('updateCall', handleUpdateCall)
addHandler('deleteCall', handleDeleteCall)
addHandler('shareCall', handleShareCall)

addHandler('createDance', handleCreateDance);
addHandler('getDanceByRef', handleGetDanceByRef)
addHandler('updateDance', handleUpdateDance)
addHandler('deleteDance', handleDeleteDance)
addHandler('shareDance', handleShareDance)

addHandler('createMusic', handleCreateMusic);
addHandler('getMusicByRef', handleGetMusicByRef)
addHandler('updateMusic', handleUpdateMusic)
addHandler('deleteMusic', handleDeleteMusic)
addHandler('shareMusic', handleShareMusic)
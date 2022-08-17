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
        modifiedAt: (Date.now() / 1000),
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

const handleGetCallByRef = (aq: ActiveQuery) => {
  if (typeof aq.callerInput?.call?.skyfeed === 'string') {
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
  } else if (typeof aq.callerInput?.call?.id === 'string') {
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
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getCallByRef requires either an `id` field or a `skyfeed` field under `call`.');
  }
};

const handleInsertCall = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('call' in aq.callerInput) {
      const call:any = aq.callerInput.call
      if (!call.id) {
        aq.reject('No id found, call not inserted.');
        return
      }
      if (!call.title) {
        aq.reject('No title found, call not inserted.');
        return
      }
      const matchedCall = calls.filter(({ id, skyfeed }) => {
        return id === call.id; // && skyfeed === call.skyfeed;
      });

      if (matchedCall.length) {
        aq.reject(`Call already has id ${call.id}, call not inserted.`);
      } else {
        setCalls([...calls, call]).then(() => {
          aq.respond({call, calls});
        })
      }
    }
    else {
      aq.reject('callerinput.call must be defined for "insertCall"');
    }
  });
}

const handleUpdateCall = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('call' in aq.callerInput) {
      const updatedCall:Call = {
        ...aq.callerInput.call,
        skyfeed: null,
        modifiedAt: (Date.now() / 1000),
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
        modifiedAt: (Date.now() / 1000),
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

const handleGetDanceByRef = (aq: ActiveQuery) => {
  if (typeof aq.callerInput?.dance?.skyfeed === 'string') {
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
  else if (typeof aq.callerInput?.dance?.id === 'string') {
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
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getDanceByRef requires either an `id` field or a `skyfeed` field under `dance`.');
  }
};

const handleInsertDance = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('dance' in aq.callerInput) {
      const dance:any = aq.callerInput.dance
      if (!dance.id) {
        aq.reject('No id found, dance not inserted.');
        return
      }
      if (!dance.title) {
        aq.reject('No title found, dance not inserted.');
        return
      }
      if (!dance.instructions) {
        aq.reject('No instructions found, dance not inserted.');
        return
      }
      const matchedDance = dances.filter(({ id, skyfeed }) => {
        return id === dance.id; // && skyfeed === dance.skyfeed;
      });

      if (matchedDance.length) {
        aq.reject(`Dance already has id ${dance.id}, dance not inserted.`);
      } else {
        setDances([...dances, dance]).then(() => {
          aq.respond({dance, dances});
        })
      }
    }
    else {
      aq.reject('callerinput.dance must be defined for "insertDance"');
    }
  });
}

const handleUpdateDance = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('dance' in aq.callerInput) {
      const updatedDance:Dance = {
        ...aq.callerInput.dance,
        skyfeed: null,
        modifiedAt: (Date.now() / 1000),
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

const handleCreateMusic = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('music' in aq.callerInput) {
      const music:any = aq.callerInput.music
      if (!music.title) {
        aq.reject('No title found, music not created.');
        return
      }
      const newMusic:Music = {
        ...music,
        id: uuid(),
        modifiedAt: (Date.now() / 1000),
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

const handleGetMusicByRef = (aq: ActiveQuery) => {
  if (typeof aq.callerInput?.music?.skyfeed === 'string') {
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
  } else if (typeof aq.callerInput?.music?.id === 'string') {
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
  } else {
    // return an error if no id included in callerInput data
    aq.reject('getMusicByRef requires either an `id` field or a `skyfeed` field under `music`.');
  }
};

const handleInsertMusic = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('music' in aq.callerInput) {
      const music:any = aq.callerInput.music
      if (!music.id) {
        aq.reject('No id found, music not inserted.');
        return
      }
      if (!music.title) {
        aq.reject('No title found, music not inserted.');
        return
      }
      const matchedMusic = musicList.filter(({ id, skyfeed }) => {
        return id === music.id; // && skyfeed === music.skyfeed;
      });

      if (matchedMusic.length) {
        aq.reject(`Music already has id ${music.id}, music not inserted.`);
      } else {
        setMusicList([...musicList, music]).then(() => {
          aq.respond({music, musicList});
        })
      }
    }
    else {
      aq.reject('callerinput.music must be defined for "insertMusic"');
    }
  });
}

const handleUpdateMusic = (aq: ActiveQuery) => {
  initializeModule().then(() => {
    if ('music' in aq.callerInput) {
      const updatedMusic:Music = {
        ...aq.callerInput.music,
        skyfeed: null,
        modifiedAt: (Date.now() / 1000),
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
addHandler('insertCall', handleInsertCall);
addHandler('updateCall', handleUpdateCall)
addHandler('deleteCall', handleDeleteCall)

addHandler('createDance', handleCreateDance);
addHandler('getDanceByRef', handleGetDanceByRef)
addHandler('insertDance', handleInsertDance);
addHandler('updateDance', handleUpdateDance)
addHandler('deleteDance', handleDeleteDance)

addHandler('createMusic', handleCreateMusic);
addHandler('getMusicByRef', handleGetMusicByRef)
addHandler('insertMusic', handleInsertMusic);
addHandler('updateMusic', handleUpdateMusic)
addHandler('deleteMusic', handleDeleteMusic)
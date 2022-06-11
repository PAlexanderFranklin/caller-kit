import {v4 as uuid} from 'uuid';

interface Call {
  id: String,
  title: String,
  text: String | null,
  duration: Number,
}

interface CallRef {
  id: String,
  duration: Number,
  skyfeed: String | null,
}

interface Dancer {
  gender: String,
  group: String,
  position: {x: Number, y: Number},
}

interface Formation {
  id: String,
  title: String,
  text: String | null,
  dancers: Array<Dancer>
}

interface Dance {
  id: String,
  title: String,
  text: String | null,
  formation: Formation,
  instructions: Array<{}>
}

let calls: Array<Call> = [];
let dances: Array<Dance> = [];
let formations: Array<Formation> = [];

const setCalls = (newCalls:Array<Call>) => {
  calls = newCalls;
}

const setDances = (newDances:Array<Dance>) => {
  dances = newDances;
}

const setFormations = (newFormations:Array<Formation>) => {
  formations = newFormations;
}

const createCall = (call:any) => {
  const newCall:Call = {
    id: uuid(),
    title: call.title,
    text: call.text,
    duration: call.duration
  };
  setCalls([...calls, newCall])
}
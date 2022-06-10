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
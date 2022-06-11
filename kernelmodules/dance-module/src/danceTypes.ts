export interface Call {
  id: String,
  title: String,
  text?: String,
  license?: String,
  beats?: Number,
  dependencies?: Array<CallRef>,
  footwork?: CallRef,
  hold?: CallRef,
}

export interface CallRef {
  id: String,
  beats?: Number,
  skyfeed?: String,
}

export interface Dancer {
  gender: String,
  group: String,
  position: {x: Number, y: Number},
}

export interface Formation {
  id: String,
  title: String,
  text?: String,
  dancers?: Array<Dancer>
}

export interface FormationRef {
  id: String,
  skyfeed?: String,
}

export interface Dance {
  id: String,
  title: String,
  text?: String,
  formation?: FormationRef,
  instructions: Array<CallRef>
  variantOf?: CallRef,
  footwork?: CallRef,
  hold?: CallRef,
}
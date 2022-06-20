export interface Call {
  id: String,
  skyfeed?: String,
  title: String,
  text?: String,
  license?: String,
  beats?: Number,
  dependencies?: Array<CallRef>,
  footwork?: CallRef,
  hold?: CallRef,
  isFootwork?: Boolean,
  isHold?: Boolean,
}

export interface CallRef {
  id: String,
  skyfeed?: String,
  beats?: Number,
}

export interface Dancer {
  gender: String,
  group: Number,
  position: {x: Number, y: Number},
}

export interface Formation {
  id: String,
  skyfeed?: String,
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
  skyfeed?: String,
  title: String,
  text?: String,
  formation?: FormationRef,
  instructions: Array<Array<CallRef>>
  variantOf?: DanceRef,
  footwork?: CallRef,
  hold?: CallRef,
}

export interface DanceRef {
  id: String,
  skyfeed?: String,
}
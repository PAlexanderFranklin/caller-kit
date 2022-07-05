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
  modifiedAt?: Date
}

export interface CallRef {
  id: String,
  title: String,
  skyfeed?: String,
  beats?: Number,
  delay?: number,
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
  title: String,
  skyfeed?: String,
}

export interface Dance {
  id: String,
  skyfeed?: String,
  title: String,
  text?: String,
  license?: String,
  formation?: FormationRef,
  instructions: Array<Array<CallRef>>
  variantOf?: DanceRef,
  footwork?: CallRef,
  hold?: CallRef,
  modifiedAt?: Date
}

export interface DanceRef {
  id: String,
  title: String,
  skyfeed?: String,
}
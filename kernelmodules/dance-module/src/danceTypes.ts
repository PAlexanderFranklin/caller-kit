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

export interface Music {
  id: String,
  title?: String,
  skyfeed?: String,
  link?: String,
  modifiedAt?: Date,
}

export interface MusicRef {
  id: String,
  title?: String,
  skyfeed?: String,
  delay?: number,
  beatsPerDanceBeat?: number,
}

export interface Dance {
  id: String,
  skyfeed?: String,
  title: String,
  text?: String,
  license?: String,
  formation?: FormationRef,
  instructions: Array<Array<CallRef>>,
  music?: Array<MusicRef>,
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
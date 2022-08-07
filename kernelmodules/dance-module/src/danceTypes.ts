export interface Call {
  id: string,
  skyfeed?: string,
  title: string,
  text?: string,
  license?: string,
  beats?: number,
  dependencies?: Array<CallRef>,
  footwork?: CallRef,
  hold?: CallRef,
  isFootwork?: Boolean,
  isHold?: Boolean,
  modifiedAt?: Date
}

export interface CallRef {
  id: string,
  title: string,
  skyfeed?: string,
  beats?: number,
  delay?: number,
}

export interface Dancer {
  gender: string,
  group: number,
  position: {x: number, y: number},
}

export interface Formation {
  id: string,
  skyfeed?: string,
  title: string,
  text?: string,
  dancers?: Array<Dancer>
}

export interface FormationRef {
  id: string,
  title: string,
  skyfeed?: string,
}

export interface Music {
  id: string,
  title?: string,
  skyfeed?: string,
  link?: string,
  modifiedAt?: Date,
}

export interface MusicRef {
  id: string,
  title?: string,
  skyfeed?: string,
  delay?: number,
  beatsPerDanceBeat?: number,
}

export interface Dance {
  id: string,
  skyfeed?: string,
  title: string,
  text?: string,
  license?: string,
  formation?: FormationRef,
  instructions: Array<Array<CallRef>>,
  music?: Array<MusicRef>,
  variantOf?: DanceRef,
  footwork?: CallRef,
  hold?: CallRef,
  modifiedAt?: Date
}

export interface DanceRef {
  id: string,
  title: string,
  skyfeed?: string,
}
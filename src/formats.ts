export type Format = {
  id: string;
  name: string;
  specification: FormatSpec;
  audioCodec: FormatAudioCodec;
  audioBitrate?: number;
  startTimecode: string;
  frameRate: FrameRate;
  noFrameRateConversion: boolean;
  ffmpegArgs?: string;
  audioArgs?: string;
  bmxArgs?: string;
  options?: FormatMxfOptions;
  noLoudness?: boolean;
  loudnessRange?: number;
  loudnessProgram?: number;
  loudnessTruePeak?: number;
  videoEdit?: FormatVideoEdit;
  writeTimecode: boolean;
  videoBitrate?: number;
  encodeSubtitle: boolean;
  crop?: FormatCropParameters;
  scale?: FormatScaleParameters;
  clip?: FormatClipParameters;
  qcTestPlan: string;
  qcReportTemplate: string;
  subtitleVersion?: Version;
  subtitleTypeVersion?: SubtitleTypeVersion;
  subtitleFormat?: string;
};

export enum FormatSpec {
  Mxf = "Mxf",
  Mp4 = "Mp4",
  ProRes422 = "ProRes422",
  ProRes4444 = "ProRes4444",
  ADN = "ADN",
  AVCIntra100 = "AVCIntra100",
  IMX50 = "IMX50",
  Mp4Salto = "Mp4Salto",
  MovH264 = "MovH264",
  MovHevc = "MovHevc",
  MxfProgressive = "MxfProgressive",
  Demux = "Demux",
  AudioExtract = "AudioExtract",
}

export enum FormatAudioCodec {
  PCMS24LE = "PCMS24LE",
  PCMS16LE = "PCMS16LE",
  PCMS24BE = "PCMS24BE",
  AAC = "AAC",
  MP3 = "MP3",
  MOV_Conteneur = "MOV_Conteneur",
}

export type FrameRate = {
  id: string;
  numerator: number;
  denominator: number;
};

export type FormatMxfOptions = {
  controlInstantaneousBitrate: boolean;
  as10: boolean;
  as11: boolean;
  bwf: boolean;
  afd?: number;
  version12: boolean;
  deinterlacing: boolean;
  qmax?: number;
};

export type FormatVideoEdit = {
  before: FormatSegment[];
  after: FormatSegment[];
};

export type FormatSegment = {
  index: number;
  kind: FormatSegmentKind;
  duration: number;
  sourceName?: string;
  sourceBucket?: string;
  sourceKey?: string;
  subtract: boolean;
};

export enum FormatSegmentKind {
  Mire = "Mire",
  Black = "Black",
  Slate = "Slate",
  Video = "Video",
  Countdown = "Countdown",
}

export type FormatCropParameters = {
  leftPx: number;
  rightPx: number;
  topPx: number;
  bottomPx: number;
};

export type FormatScaleParameters = {
  width: number;
  height: number;
  scaleAspectRatio: boolean;
  scaleLetterbox: boolean;
};

export type FormatClipParameters = {
  clipMin: number;
  clipMax: number;
};

export type FormatSubtitle = {
  id: string;
  name: string;
  fileFormat: SubtitleFileFormat;
  subtitleTimecode?: string;
  subtitleFrameRate?: FrameRate;
  displayStandard?: SubtitleDisplayStandard;
  offset?: string;
};

export enum SubtitleFileFormat {
  STL = "STL",
  WebVTT = "WebVTT",
  SRT = "SRT",
}

export enum SubtitleDisplayStandard {
  Open = "Open",
  Teletext1 = "Teletext1",
  Teletext2 = "Teletext2",
}

export enum SubtitleTypeVersion {
  PARTIAL = "PARTIAL",
  COMPLETE = "COMPLETE",
  COMPLETE_WITHOUT_PARTIAL = "COMPLETE_WITHOUT_PARTIAL",
  SDH = "SDH",
}

export enum SegmentLabel {
  OpeningCredits = "OpeningCredits",
  EndingCredits = "EndingCredits",
  Introduction = "Introduction",
  Program = "Program",
  Trailer = "Trailer",
  Advertising = "Advertising",
  TestPattern = "TestPattern",
  Black = "Black",
  Slate = "Slate",
  NeutralBases = "NeutralBases",
  CustomDelivery = "CustomDelivery",
}

export enum Version {
  ARA = "ARA",
  CHI = "CHI",
  KOR = "KOR",
  DAN = "DAN",
  DUT = "DUT",
  HEB = "HEB",
  NLD = "NLD",
  RUS = "RUS",
  SWE = "SWE",
  FRA = "FRA",
  GER = "GER",
  ITA = "ITA",
  POR = "POR",
  ENG = "ENG",
  SPA = "SPA",
  JPN = "JPN",
  NOR = "NOR",
  UKR = "UKR",
  INT = "INT",
  NOTHING = "",
}

export enum Mapping {
  AsMaster = "AsMaster",
  NoSound = "NoSound",
  VD = "VD",
  VO = "VO",
  VI = "VI",
  VDVO = "VDVO",
  VOAD = "VOAD",
  VDAD = "VDAD",
  VIVD = "VIVD",
  VIVO = "VIVO",
  VDVOAD = "VDVOAD",
  VDVIVONLY = "VDVIVONLY",
  VDVIMEVONLY = "VDVIMEVONLY",
}

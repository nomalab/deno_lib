export interface Job {
  id: string;
  createdAt: string;
  startedAt: null;
  completedAt: string;
  show: string;
  organization: string;
  requester: string;
  jobType:
    | "DownloadAsIs"
    | "PADTranscode"
    | "QC"
    | "SimpleTranscode"
    | "Spotcheck";
  externalJobId: null;
  format: string;
  startedBy: null;
  completedBy: null;
  acknowledge: boolean;
  acknowledgedBy: null;
}
export interface Path {
  showId: string;
  path: PathElement[];
}

export interface PathElement {
  value: string;
  nodeId?: string;
  kind: "Delivery" | "Master" | "Collection" | "Unitary" | "Season" | "Episode";
  showId?: string;
}

export interface Show {
  show: ShowClass;
  metadata: Metadata;
  jobs: Job[];
  creator: Creator;
  organization: ShowOrganization;
  channels: any[];
  invitations: any[];
  timeline: any[];
  extras: any[];
  activeBroadcastable: ActiveBroadcastable;
  previousBroadcastables: any[];
}

export interface ActiveBroadcastable {
  broadcastable: Broadcastable;
  files: Files;
  comments: any[];
}

export interface Broadcastable {
  id: string;
  show: string;
  createdAt: string;
  deliveryProgress: null;
  duration: null;
  framerate: null;
  rejection: null;
  uploadLog: null;
  generatedWithMapping: null;
}

export interface Files {
  material: Material;
  audios: any[];
  subtitles: Subtitle[];
}

export interface Material {
  file: ReportPDFClass;
  container: Container;
  streams: Array<Array<PurpleStream | string>>;
  proxies: Proxies;
  reportXml: ReportPDFClass;
  reportPdf: ReportPDFClass;
  deliveries: Delivery[];
  segments: Segment[];
}

export interface Container {
  fileId: string;
  formatName: string;
  formatLongName: string;
  duration: number;
  bitRate: number;
  timecode: null;
}

export interface Deliveries {
  shows:           Show[];
  nodes:           DeliveryNode[];
  formats:         DeliveriesFormat[];
  subtitleFormats: SubtitleFormat[];
}

export interface DeliveriesFormat {
  organizationId:                              string;
  organizationName:                            string;
  organizationAllowDeliveryWithoutTranscoding: boolean;
  formats:                                     FormatElement[];
}

export interface FormatElement {
  id:   string;
  name: string;
}

export interface DeliveryNode {
  showId: string;
  id:     string;
  name:   string;
  parent: null | string;
}

export interface Subtitles {
  subtitle: any[];
}

export enum ArchiveState {
  Active = "active",
  Archived = "archived",
}

export interface SubtitleFormat {
  organizationId:   string;
  organizationName: string;
  subtitleFormats:  FormatElement[];
}
export interface DeliverPayload {
  format:         string;
  versionMapping: "VFVO"|"VF"|"VO";
  timecodeOut:    string | null;
  timecodeIn:     string | null;
  subtitles:      DeliverSubtitle | null;
  targetOrg:      string;
  targetId:       null;
}
export interface DeliverSubtitle {
  format: string | null;
  id: string;
  name: string | null;
}

export interface Delivery {
  id: string;
  title: string;
  organizationName: string;
  transcoding: DeliveryTranscoding;
}

export interface DeliveryTranscoding {
  file: string;
  phase: Phase;
  progress: number | null | string;
  startedAt: string;
  progressedAt: string;
  log: null | string;
  warning: any[];
}

export enum Phase {
  Encoding = "Encoding",
  Finished = "Finished",
  Packaging = "Packaging",
  Waiting = "Waiting",
}

export interface ReportPDFClass {
  state: string;
  stateExpireAt: null;
  id: string;
  createdAt: string;
  name: string;
  size: number;
  mimeType: null | string;
  bucket: string;
  key: string;
  kind: string;
  uploaderId: null | string;
  upload: Upload | null;
  uploadedAt: null | string;
  verification: Verification | null;
  sourceId: null | string;
  transcoding: FileTranscoding | null;
  format: null;
}

export interface FileTranscoding {
  file: string;
  phase: Phase;
  progress: number | null;
  startedAt: string;
  progressedAt: string;
  log: null | string;
  warning: any[];
}

export interface Upload {
  file: string;
  user: string;
  progress: number;
  progressedAt: string;
  pausedAt: null;
  completedAt: string;
  error: null;
  s3Id: string;
  speed: number;
  secondsLeft: number;
  source: string;
}

export interface Verification {
  progress: number;
  error: null;
  result: Result;
}

export interface Result {
  nbErrors: number;
  nbWarnings: number;
  report: Report;
}

export interface Report {
  file: ReportFile;
  streams: { [key: string]: StreamValue };
}

export interface ReportFile {
  size: number;
  format: string;
  lastModified: null;
}

export interface StreamValue {
  id: string;
  name: string;
  issues: Issues;
  parent: string;
  nodeType: Array<Array<PurpleNodeType | string> | FluffyNodeType | string>;
  properties: Properties;
}

export interface Issues {
  errors: any[];
  warnings: any[];
}

export interface PurpleNodeType {
  duration: string;
  startTimecode: string;
}

export interface FluffyNodeType {
  frameRate?: null;
  chromaFormat?: null;
  scanningType?: null;
  cadencePattern?: null;
  activePixelsArea?: null;
  displayAspectRatio?: null;
  isMute?: boolean;
  channels?: Channel[];
  loudnessRange?: string;
  programLoudness?: string;
}

export interface Channel {
  label: string;
  truePeakLevel: string;
}

export interface Properties {
  MD5?: LivingstoneSouthernWhiteFacedOwl;
  FileSize?: LivingstoneSouthernWhiteFacedOwl;
  "Audio PIDs"?: LivingstoneSouthernWhiteFacedOwl;
  "Hint Track"?: LivingstoneSouthernWhiteFacedOwl;
  "Movie Type"?: LivingstoneSouthernWhiteFacedOwl;
  "Video PIDs"?: LivingstoneSouthernWhiteFacedOwl;
  AudioTracks?: LivingstoneSouthernWhiteFacedOwl;
  "Data Format"?: LivingstoneSouthernWhiteFacedOwl;
  VideoTracks?: LivingstoneSouthernWhiteFacedOwl;
  "3GPP Profile"?: LivingstoneSouthernWhiteFacedOwl;
  "Atom Presence"?: LivingstoneSouthernWhiteFacedOwl;
  "Creation Time"?: LivingstoneSouthernWhiteFacedOwl;
  DisabledTrack?: LivingstoneSouthernWhiteFacedOwl;
  "MP4::Duration"?: LivingstoneSouthernWhiteFacedOwl;
  "Clean Aperture"?: LivingstoneSouthernWhiteFacedOwl;
  "Timed Text Track"?: LivingstoneSouthernWhiteFacedOwl;
  "MP4::ChannelCount"?: LivingstoneSouthernWhiteFacedOwl;
  "Modification Time"?: LivingstoneSouthernWhiteFacedOwl;
  "MP4::TimeCodeTrack"?: MP4TimeCodeTrackClass;
  AudioLangTrackIDMap?: LivingstoneSouthernWhiteFacedOwl;
  "Audio Channel Layout"?: LivingstoneSouthernWhiteFacedOwl;
  "Progressive Download"?: LivingstoneSouthernWhiteFacedOwl;
  Duration?: LivingstoneSouthernWhiteFacedOwl;
  "Frame Rate"?: LivingstoneSouthernWhiteFacedOwl;
  Resolution?: LivingstoneSouthernWhiteFacedOwl;
  "Scan Order"?: LivingstoneSouthernWhiteFacedOwl;
  "Field Order"?: LivingstoneSouthernWhiteFacedOwl;
  "Video Format"?: LivingstoneSouthernWhiteFacedOwl;
  "Active Format"?: LivingstoneSouthernWhiteFacedOwl;
  "Active Pixels"?: LivingstoneSouthernWhiteFacedOwl;
  "Chroma Format"?: LivingstoneSouthernWhiteFacedOwl;
  "GOP Structure"?: LivingstoneSouthernWhiteFacedOwl;
  "Bits Per Pixel"?: LivingstoneSouthernWhiteFacedOwl;
  "Average Bitrate"?: LivingstoneSouthernWhiteFacedOwl;
  ProresCodecType?: LivingstoneSouthernWhiteFacedOwl;
  "Color Information"?: LivingstoneSouthernWhiteFacedOwl;
  "Sample Aspect Ratio"?: LivingstoneSouthernWhiteFacedOwl;
  "Display Aspect Ratio"?: LivingstoneSouthernWhiteFacedOwl;
  "Picture Scanning Type"?: LivingstoneSouthernWhiteFacedOwl;
  "Bit Rate"?: LivingstoneSouthernWhiteFacedOwl;
  "Audio Pop"?: LivingstoneSouthernWhiteFacedOwl;
  Endianness?: LivingstoneSouthernWhiteFacedOwl;
  "Audio Click"?: LivingstoneSouthernWhiteFacedOwl;
  "LFE Channels"?: LivingstoneSouthernWhiteFacedOwl;
  "Audio Crackle"?: LivingstoneSouthernWhiteFacedOwl;
  Duration_msec?: LivingstoneSouthernWhiteFacedOwl;
  "Audio Channels"?: LivingstoneSouthernWhiteFacedOwl;
  "Phase Mismatch"?: LivingstoneSouthernWhiteFacedOwl;
  "Audio::Duration"?: LivingstoneSouthernWhiteFacedOwl;
  "Bits per sample"?: LivingstoneSouthernWhiteFacedOwl;
  ProgLoudnessEBU?: ProgLoudnessEBUClass;
  "Wow and Flutter"?: LivingstoneSouthernWhiteFacedOwl;
  LoudnessRangeEBU?: LivingstoneSouthernWhiteFacedOwl;
  TruePeakLevelEBU?: LivingstoneSouthernWhiteFacedOwl;
  ShortTermLoudness?: LivingstoneSouthernWhiteFacedOwl;
  "Momentary Loudness"?: LivingstoneSouthernWhiteFacedOwl;
  "Sampling Frequency"?: LivingstoneSouthernWhiteFacedOwl;
  "Stereo Pair Detection"?: LivingstoneSouthernWhiteFacedOwl;
}

export interface LivingstoneSouthernWhiteFacedOwl {
  $: Purple;
}

export interface Purple {
  area: any[];
  name: string;
  value: null | string;
  mapping: MaxShortTermLoudness[];
  SystemItem: ProgramLoudnessEbu[];
  TimeCodeTrack: ProgramLoudnessEbu[];
  TimecodeTrack: ProgramLoudnessEbu[];
  ProgramLoudnessEBU: ProgramLoudnessEbu[];
  VideoTrackProperty: ProgramLoudnessEbu[];
  MaxShortTermLoudness: MaxShortTermLoudness[];
}

export interface MaxShortTermLoudness {
  $: Fluffy;
}

export interface Fluffy {
  key: null | string;
  value: null | string;
}

export interface ProgramLoudnessEbu {
}

export interface MP4TimeCodeTrackClass {
  $: MP4TimeCodeTrack;
}

export interface MP4TimeCodeTrack {
  area: any[];
  name: string;
  value: null;
  mapping: any[];
  SystemItem: ProgramLoudnessEbu[];
  TimeCodeTrack: TimeCodeTrack[];
  TimecodeTrack: ProgramLoudnessEbu[];
  ProgramLoudnessEBU: ProgramLoudnessEbu[];
  VideoTrackProperty: ProgramLoudnessEbu[];
  MaxShortTermLoudness: any[];
}

export interface TimeCodeTrack {
  "#PCDATA": MaxShortTermLoudness;
  TrackID: MaxShortTermLoudness;
  Duration: MaxShortTermLoudness;
  DropFrameFlag: MaxShortTermLoudness;
  DurationSMPTE: MaxShortTermLoudness;
  StartTimeCode: MaxShortTermLoudness;
  TimeCodeTrack: MaxShortTermLoudness;
  StartTimeCodeSMPTE: MaxShortTermLoudness;
}

export interface ProgLoudnessEBUClass {
  $: ProgLoudnessEBU;
}

export interface ProgLoudnessEBU {
  area: any[];
  name: string;
  value: null;
  mapping: any[];
  SystemItem: ProgramLoudnessEbu[];
  TimeCodeTrack: ProgramLoudnessEbu[];
  TimecodeTrack: ProgramLoudnessEbu[];
  ProgramLoudnessEBU: ProgramLoudnessEBU[];
  VideoTrackProperty: ProgramLoudnessEbu[];
  MaxShortTermLoudness: any[];
}

export interface ProgramLoudnessEBU {
  end: MaxShortTermLoudness;
  level: MaxShortTermLoudness;
  start: MaxShortTermLoudness;
  "#PCDATA": MaxShortTermLoudness;
}

export interface Proxies {
  lowRes: ReportPDFClass;
  hiRes: null;
}

export interface Segment {
  id: string;
  label: string;
  creator: Creator;
  createdAt: string;
  file: string;
  frameIn: number;
  frameOut: number;
}

export interface Creator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  organization: string;
  organizations: OrganizationElement[];
  isSetup: boolean;
  admin: boolean;
  disableOrganizationEmails: boolean;
}

export interface OrganizationElement {
  userId: string;
  organizationId: string;
  organizationName: string;
  logo: null | string;
}

export interface PurpleStream {
  fileId: string;
  index: number;
  codecName?: string;
  codecLongName?: string;
  duration?: number;
  width?: number;
  height?: number;
  displayAspectRatioNumerator?: number;
  displayAspectRatioDenominator?: number;
  bitRate?: number;
  rFrameRateNumerator?: number;
  rFrameRateDenominator?: number;
  level?: null;
  profile?: null;
  startTime?: number;
  chromaSubsampling?: string;
  scanningType?: string;
  timecode?: string;
  sampleRate?: number;
  sampleFormat?: string;
  channels?: number;
  bitsPerSample?: number;
  channelLayout?: string;
  version?: string;
  typeVersion?: string;
}

export interface Subtitle {
  file: ReportPDFClass;
  container: null;
  streams: Array<Array<FluffyStream | string>>;
  proxies: Proxies;
  reportXml: null;
  reportPdf: null;
  deliveries: any[];
  segments: any[];
}

export interface FluffyStream {
  fileId: string;
  index: number;
  codecName: null;
  codecLongName: null;
  version: null;
  typeVersion: null;
  frameRateNumerator: number;
  frameRateDenominator: number;
  startTimecode: string;
  firstCueTimecode: string;
  subtitleType: string;
}

export interface Metadata {
  show: string;
  firstBroadcastedAt: null;
  broadcasterShowId: null;
  enableAutoAccept: boolean;
  productionCompanyName: null;
  productionYear: null;
  programType: null;
  fileType: null;
  fileFormat: null;
  aspectRatio: null;
  textedVideoType: null;
}

export interface ShowOrganization {
  id: string;
  name: string;
  createdAt: string;
  qcMasterTestPlan: string;
  qcMasterReportTemplate: string;
  enableCreationEmail: boolean;
  enableVideoReadyEmail: boolean;
  enableUploadSuccessEmail: boolean;
  enableAutoAccept: boolean;
  enableAutoReject: boolean;
  broadcaster: null;
  manualDelivery: boolean;
  allowDeliveryWithoutTranscoding: boolean;
  logo: null;
  webhooks: Webhook[];
  formats: any[];
  subtitleFormats: any[];
}

export interface Webhook {
  id: string;
  organization: string;
  event: string;
  activated: boolean;
  params: Params;
}

export interface Params {
  kind: string;
  url: string;
  format: string;
}

export interface ShowClass {
  id: string;
  creator: string;
  createdAt: string;
  updater: string;
  updatedAt: string;
  title1: string;
  title2: string | null;
  organization: string;
  accepted: boolean;
  commandInfoXML: null;
  kind: ShowKind;
  state: ArchiveState;
  parent: string;
}

export enum BroadcastableKind {
  Subtitle = "Subtitle",
  Material = "Material",
  Audio = "Audio",
  Extra = "Extra"
}

export interface CopyToBroadcastable {
  kind: BroadcastableKind;
  broadcastable: string;
  key: string;
  bucket: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  qcMasterTestPlan: string;
  qcMasterReportTemplate: string;
  destination: null | string;
  downloadFileName: null | string;
  enableCreationEmail: boolean;
  enableVideoReadyEmail: boolean;
  enableUploadSuccessEmail: boolean;
  enableAutoAccept: boolean;
  enableAutoReject: boolean;
  broadcaster: null | string;
  manualDelivery: boolean;
  allowDeliveryWithoutTranscoding: boolean;
  replication: boolean;
  logo: null | string;
  formats: Format[];
  subtitleFormats: Format[];
}

export interface Format {
  id: string;
  name: string;
}

export interface Node {
  node: NodeClass;
  events: Array<Array<EventClass | EventEnum>>;
}

export interface EventClass {
  id: string;
  show: string;
  title: string;
  subtitle: null;
  timestamp: string;
  kind?: Kind;
  fileId?: string;
  fileName?: string;
  formatName?: string;
  nbWarning?: number;
  error?: null;
  mxfIn: null | string;
  mxfOut: null | string;
  mxfVersion: MXFVersion | null;
  subtitlesFileName: null | string;
  targetOrganization: null | string;
  transcodeKind?: TranscodeKind;
  result?: Result | null;
  fileBucket?: string;
  fileKey?: string;
  source?: Source;
}

export enum Kind {
  Create = "Create",
  Finish = "Finish",
  Request = "Request",
}

export enum MXFVersion {
  AsMaster = "AsMaster",
  Vd = "VD",
  Vo = "VO",
}

export interface Result {
  nbErrors: number;
  nbWarnings: number;
}

export interface Source {
  id: string;
  name: string;
  email: string;
  organization: string;
  organizationName: string;
  avatar: string;
}

export enum TranscodeKind {
  Copy = "copy",
  Deliverable = "deliverable",
  ProxyLowRes = "proxy_low_res",
  ProxySubtitle = "proxy_subtitle",
}

export enum NodeKind {
  Season = "Season",
  Collection = "Collection",
  Episode = "Episode",
  Unitary = "Unitary",
}

export enum ShowKind {
  Delivery = "Delivery",
  Master = "Master",
}

export enum EventEnum {
  Ingest = "Ingest",
  Lifecycle = "Lifecycle",
  QualityCheck = "QualityCheck",
  Transcode = "Transcode",
}

export interface NodeClass {
  id: string;
  creator: string;
  createdAt: string;
  name: string;
  organization: string;
  parent: string;
  kind: NodeKind;
  state: string;
}

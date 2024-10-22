import * as Formats from "./formats.ts";

export interface MeUser {
  admin: boolean;
  avatar: string;
  disableOrganizationEmails: boolean;
  email: string;
  id: string;
  name: string;
  organization: string;
  organizations: {
    organizationId: string;
    organizationName: string;
    logo?: string;
  }[];
}

export interface Job {
  id: string;
  createdAt: string;
  startedAt: null | string;
  completedAt: null | string;
  show: string;
  organization: string;
  requester: string;
  jobType:
    | "DownloadAsIs"
    | "PADTranscode"
    | "QC"
    | "SimpleTranscode"
    | "Spotcheck";
  externalJobId: null | string;
  format: null | string;
  startedBy: null | string;
  completedBy: null | string;
  acknowledge: boolean;
  acknowledgedBy: null | string;
}

export interface ShowPath {
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
  channels: unknown[];
  invitations: unknown[];
  extras: ExtraFile[];
  activeBroadcastable: BroadcastableApi;
  previousBroadcastables: BroadcastableApi[];
}

export interface BroadcastableApi {
  broadcastable: Broadcastable;
  files: Files;
  comments: unknown[];
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
  audios: Material[];
  subtitles: Material[];
}

export interface ExtraFile {
  file: FileClass;
  container: null | Container;
  streams: FileStream[];
  proxy: null | FileClass;
  segments: FileSegment[];
}

export interface Material {
  file: FileClass;
  container: Container;
  streams: FileStream[];
  proxies: Proxies;
  reportXml: FileClass;
  reportPdf: FileClass;
  deliveries: Delivery[];
  segments: Segment[];
  subtitleWarnings: SubtitleWarning[];
}

export interface Container {
  fileId: string;
  formatName: string;
  formatLongName: string;
  duration: number;
  bitRate: number;
  timecode: null;
}

export interface AudioMappingPayload {
  index: number;
  channelLayout?: string;
  version?: string;
  typeVersion?: string;
}

export interface Deliveries {
  shows: Show[];
  nodes: DeliveryNode[];
  formats: DeliveriesFormat[];
  subtitleFormats: SubtitleFormat[];
}

export interface DeliveriesFormat {
  organizationId: string;
  organizationName: string;
  organizationAllowDeliveryWithoutTranscoding: boolean;
  formats: FormatElement[];
}

export interface FormatElement {
  id: string;
  name: string;
}

export interface DeliveryNode {
  showId: string;
  id: string;
  name: string;
  parent: null | string;
}

export interface SubtitleWarning {
  name: string;
  timecode: string;
}

export interface SubtitleFormat {
  organizationId: string;
  organizationName: string;
  subtitleFormats: FormatElement[];
}

export interface SubtitleFormatApi {
  id: string;
  name: string;
  format: string;
}

export interface SubtitleFormats {
  id: string;
  name: string;
  format: Formats.SubtitleFileFormat;
  start_timecode?: string;
  frame_rate?: Formats.FrameRate;
  display_standard?: Formats.SubtitleDisplayStandard;
  offset?: string;
}

export interface DeliverPayload {
  format: string;
  versionMapping: Formats.Mapping;
  timecodeOut?: string;
  timecodeIn?: string;
  segments?: string[];
  subtitles: DeliverSubtitle | null;
  targetOrg: string;
  targetId: string | null;
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
  progress: null | number;
  startedAt: string;
  progressedAt: string;
  log: null | string;
  warning: TranscodeWarning[];
}

export interface FileTranscoding {
  file: string;
  phase: Phase;
  progress: number | null;
  startedAt: string;
  progressedAt: string;
  log: null | string;
  warning: unknown[];
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
  nodeType: NodeType;
  properties: Properties;
}

export interface Issues {
  errors: unknown[];
  warnings: unknown[];
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
  area: unknown[];
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

// deno-lint-ignore no-empty-interface
export interface ProgramLoudnessEbu {
}

export interface MP4TimeCodeTrackClass {
  $: MP4TimeCodeTrack;
}

export interface MP4TimeCodeTrack {
  area: unknown[];
  name: string;
  value: null;
  mapping: unknown[];
  SystemItem: ProgramLoudnessEbu[];
  TimeCodeTrack: TimeCodeTrack[];
  TimecodeTrack: ProgramLoudnessEbu[];
  ProgramLoudnessEBU: ProgramLoudnessEbu[];
  VideoTrackProperty: ProgramLoudnessEbu[];
  MaxShortTermLoudness: unknown[];
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
  area: unknown[];
  name: string;
  value: null;
  mapping: unknown[];
  SystemItem: ProgramLoudnessEbu[];
  TimeCodeTrack: ProgramLoudnessEbu[];
  TimecodeTrack: ProgramLoudnessEbu[];
  ProgramLoudnessEBU: ProgramLoudnessEBU[];
  VideoTrackProperty: ProgramLoudnessEbu[];
  MaxShortTermLoudness: unknown[];
}

export interface ProgramLoudnessEBU {
  end: MaxShortTermLoudness;
  level: MaxShortTermLoudness;
  start: MaxShortTermLoudness;
  "#PCDATA": MaxShortTermLoudness;
}

export interface Proxies {
  lowRes: FileClass;
  hiRes: FileClass | null;
}

export interface Segment {
  id: string;
  label: string | Formats.SegmentLabel;
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

export type FileStream =
  | ["VideoStream", FileVideoStream]
  | ["AudioStream", FileAudioStream]
  | ["SubtitleStream", FileSubtitleStream]
  | ["DataStream", FileDataStream];

export interface FileVideoStream {
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
  rFrameRateNumerator: number;
  rFrameRateDenominator: number;
  level?: number;
  profile?: string;
  startTime?: number;
  chromaSubsampling?: string;
  scanningType?: string;
  timecode?: string;
  nbFrames?: number;
}

export interface FileAudioStream {
  fileId: string;
  index: number;
  codecName: string;
  codecLongName: string;
  duration?: number;
  sampleRate: number;
  sampleFormat: string;
  channels: number;
  bitsPerSample: number;
  bitRate: number;
  channelLayout: Formats.Layout | null;
  version: Formats.Version | null;
  typeVersion: Formats.TypeVersion | null;
}

export interface FileSubtitleStream {
  fileId: string;
  index: number;
  codecName?: string;
  codecLongName?: string;
  version?: Formats.Version;
  frameRateNumerator?: number;
  frameRateDenominator?: number;
  startTimecode?: string;
  firstCue?: string;
  subtitleType?: string;
  typeVersion: Formats.SubtitleTypeVersion | null;
}

export interface FileDataStream {
  fileId: string;
  index: number;
  timecode?: string;
}

export interface FluffyStream {
  fileId: string;
  index: number;
  codecName: null;
  codecLongName: null;
  version?: string;
  typeVersion: string;
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
  formats: unknown[];
  subtitleFormats: unknown[];
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
  state: State;
  parent: string;
}

export enum BroadcastableKind {
  Subtitle = "Subtitle",
  Material = "Material",
  Audio = "Audio",
  Extra = "Extra",
}

export interface CopyToBroadcastable {
  kind: BroadcastableKind;
  broadcastable: string;
  destRole: string | undefined;
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
  formats: FormatClass[];
  subtitleFormats: FormatClass[];
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
  formats: unknown[];
  subtitleFormats: unknown[];
}

export interface FormatClass {
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

export type DeliverableOrganization = {
  id: string;
  name: string;
  allowDeliveryWithoutTranscoding: boolean;
};

export type DeliveryApi = {
  nodes: NodeDelivery[];
  shows: ShowClass[];
};

export type NodeDelivery = {
  showId: string;
  id: string;
  name: string;
  parent?: string;
};

export interface FileContainer {
  fileId: string;
  formatName: string;
  formatLongName: string;
  duration?: number;
  bitRate?: number;
  timecode?: string;
}

export interface FileLike {
  name: string;
  mimeType?: string;
}

export enum BroadcastableFileKind {
  ProxyManifest = "ProxyManifest",
  ProxyImfManifest = "ProxyImfManifest",
  ProxyDcpManifest = "ProxyDcpManifest",
  ProxyDcdmManifest = "ProxyDcdmManifest",
  ProxyAudioMergeManifest = "ProxyAudioMergeManifest",
  ProxyDashVideo = "ProxyDashVideo",
  ProxyAudio = "ProxyAudio",
  ProxySubtitle = "ProxySubtitle",
  VerificationReportPdf = "VerificationReportPdf",
  VerificationReportXml = "VerificationReportXml",
  DeepProbeReportJson = "DeepProbeReportJson",
  Video = "Video",
  Audio = "Audio",
  Subtitle = "Subtitle",
  Extra = "Extra",
  M2CWorkFile = "M2CWorkFile",
}

export interface FileClass {
  state: string;
  stateExpireAt: string | null;
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
  transcoding: Transcoding | null;
  format: Formats.Format;
}

export interface FileUploads {
  uploads: FileClass[];
  parts: UploadPart[];
}

export interface UploadPart {
  uploadId: string;
  key: string;
}

export interface FileLinkQueries {
  download: boolean;
}

export interface NewFile {
  name: string;
  size: number;
  mimeType?: string;
  bucket: string;
  key: string;
  kind: Kind;
  uploaderId?: string;
  upload: Upload | null;
  sourceId?: string;
  transcoding: Transcoding | null;
}

export interface BroadcastableApi {
  file: FileClass;
  container: FileContainer | null;
  streams: FileStream[];
  proxies: Proxies;
  reportXml: FileClass | null;
  reportPdf: FileClass | null;
  deliveries: Delivery[];
  segments: FileSegment[];
  subtitleWarnings: { name: string; timecode: string }[];
}

export interface FileSegment {
  id: string;
  label: Formats.SegmentLabel;
  creator: User;
  createdAt: string;
  file: string;
  frameIn: number;
  frameOut: number;
}

export interface FileSegmentPayload {
  label: Formats.SegmentLabel;
  frameIn: number;
  frameOut: number;
}

export interface CreateFile {
  name: string;
  size: number;
  mimeType?: string;
  source?: string;
  kind: BroadcastableFileKind;
}

export interface ResumeFile {
  name: string;
  kind: BroadcastableFileKind;
}

export enum FileTypeVideo {
  Mxf = "Mxf",
  Qtff = "Qtff",
  Mp4 = "Mp4",
}

export enum FileTypeAudio {
  Mp3 = "Mp3",
}

export type FileType =
  | ["FileTypeVideo", FileTypeVideo]
  | ["FileTypeAudio", FileTypeAudio]
  | ["FileTypeSubtitle"];

export enum Phase {
  Waiting = "Waiting",
  Downloading = "Downloading",
  Encoding = "Encoding",
  Packaging = "Packaging",
  Uploading = "Uploading",
  Finished = "Finished",
}

export interface TranscodeWarning {
  name: string;
  count: number;
  firstFrameApprox: number;
}

export interface Transcoding {
  file?: string;
  phase: Phase;
  progress?: number;
  startedAt: string;
  progressedAt: string;
  log?: string;
  warning: TranscodeWarning[];
}

export interface Progress {
  phase: Phase;
  progress?: number;
}

export interface Upload {
  file: string;
  user: string;
  progress: number;
  progressedAt: string;
  pausedAt?: string;
  completedAt?: string;
  error?: string;
  s3Id?: string;
  speed: number;
  secondsLeft?: number;
  source?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  organization?: string;
  organizations: OrganizationUserWithLabel[];
  admin: boolean;
  disableOrganizationEmails: boolean;
}

export interface OrganizationUserWithLabel {
  organizationId: string;
  organizationName: string;
  logo?: string;
}

export interface OrganizationUser {
  userId: string;
  organizationId: string;
}

export type NodeType =
  | ["AudioProgram", AudioProgram]
  | ["VideoProgram", VideoProgram]
  | ["Container", ContainerProgram]
  | ["UnknownNodeType"];

export interface AudioProgram {
  programLoudness?: string;
  loudnessRange?: string;
  channels: AudioChannel[];
  isMute: boolean;
}

export interface AudioChannel {
  label: string;
  truePeakLevel: string;
}

export interface VideoProgram {
  displayAspectRatio?: string;
  frameRate?: string;
  activePixelsArea?: string;
  cadencePattern?: string;
  chromaFormat?: string;
  scanningType?: string;
}

export type ContainerProgram =
  | ["Mxf", MxfContainerProperties]
  | ["Mov", MovContainerProperties]
  | ["UnsupportedContainer"];

export interface MovContainerProperties {
  startTimecode?: string;
  duration?: string;
}

export interface MxfContainerProperties {
  operationalPattern?: string;
  timeCodes: TimeCodes;
  product: Product;
}

export interface TimeCodes {
  duration?: string;
  systemItemStart?: string;
  sourcePackageStart?: string;
  materialPackageStart?: string;
  hasVitc?: string;
}

export interface Product {
  name?: string;
  version?: string;
  issuer?: string;
}

export enum State {
  Active = "Active",
  Archived = "Archived",
  Restoring = "Restoring",
}

export type BroadcastableProxies = {
  broadcastable: {
    imf?: FileClass;
    dcp?: FileClass;
    dcdm?: FileClass;
    audiomerge?: FileClass;
  };
  files: Record<string, {
    lowres?: FileClass;
    hires?: FileClass;
  }>;
};

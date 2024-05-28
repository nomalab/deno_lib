// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class AlreadyPresentDeliverable extends Error {
    constructor(msg){
        super(msg);
        this.name = "Inaccessible";
    }
}
class Nomalab {
    #context;
    #apiToken;
    constructor(context, apiToken){
        this.#context = context;
        this.#apiToken = apiToken;
    }
    async me() {
        const response = await this.#fetch(`users/me`);
        return response.json();
    }
    async getShow(showUuid) {
        const response = await this.#fetch(`shows/${showUuid}`);
        return response.json();
    }
    async getRoots(organizationId) {
        const response = await this.#requestWithSwitch(organizationId, "hierarchy");
        return response.json();
    }
    async createHierarchy(organizationId, name, kind, parent) {
        const response = await this.#requestWithSwitch(organizationId, "hierarchy", {
            method: "POST",
            bodyJsonObject: {
                name,
                parent,
                kind
            }
        });
        return response.json();
    }
    async createShow(nodeId, name, kind) {
        const response = await this.#fetch(`hierarchy/${nodeId}/shows`, {
            method: "POST",
            bodyJsonObject: {
                name,
                kind
            }
        });
        const { id  } = await response.json();
        return id;
    }
    async #requestWithSwitch(organizationId, partialUrl, optionalArg = {}) {
        const response = await this.#fetch(`users/switch`, {
            bodyJsonObject: {
                organization: organizationId
            },
            method: "POST"
        });
        if (this.#apiToken && response.headers.has("set-cookie")) {
            response.headers.getSetCookie().forEach((sc)=>{
                const [name, value, ..._xs] = sc.split(";")[0]?.split("=");
                if (name == "sessionJwt") {
                    this.#apiToken = value;
                }
            });
        }
        await response.body?.cancel();
        return this.#fetch(partialUrl, optionalArg);
    }
    async getChildren(nodeUuid) {
        const response = await this.#fetch(`hierarchy/${nodeUuid}/children`, {});
        return response.json();
    }
    async getDeliveries() {
        const response = await this.#fetch(`shows/deliveries`, {});
        return response.json();
    }
    async getNode(nodeUuid) {
        const response = await this.#fetch(`hierarchy/${nodeUuid}`, {});
        return response.json();
    }
    async getShowsForNode(nodeUuid) {
        const response = await this.#fetch(`hierarchy/${nodeUuid}/shows`, {});
        return response.json();
    }
    async getPath(showUuid) {
        const response = await this.#fetch(`admin/shows/path`, {
            bodyJsonObject: {
                showIds: [
                    showUuid
                ]
            },
            method: "POST"
        });
        return response.json();
    }
    async getOrganizations() {
        const response = await this.#fetch(`organizations`, {});
        return response.json();
    }
    async getOrganization(organizationId) {
        const organisation = (await this.getOrganizations()).filter((org)=>{
            return org.id == organizationId;
        });
        if (organisation.length == 0) {
            return Promise.reject(`Org ${organizationId} not found`);
        }
        return Promise.resolve(organisation[0]);
    }
    async getOrganizationByName(organizationName) {
        const organisation = (await this.getOrganizations()).filter((org)=>{
            return org.name == organizationName;
        });
        if (organisation.length == 0) {
            return Promise.reject(`Org ${organizationName} not found`);
        }
        return Promise.resolve(organisation[0]);
    }
    async getJob(jobUuid) {
        const response = await this.#fetch(`jobs/${jobUuid}`, {});
        return response.json();
    }
    async getSegments(fileId) {
        const response = await this.#fetch(`files/${fileId}/segments`, {});
        return response.json();
    }
    async s3Upload(payload) {
        const url = payload.destRole ? "aws/copyFromExt" : "aws/copy";
        await this.#fetch(url, {
            bodyJsonObject: payload,
            method: "POST"
        });
        return Promise.resolve();
    }
    async accept(showId) {
        const response = await this.#fetch(`shows/${showId}/accept`, {
            method: "POST"
        });
        return response.json();
    }
    deliver(broadcastableId, deliverPayload) {
        return this.#fetch(`broadcastables/${broadcastableId}/deliver`, {
            bodyJsonObject: deliverPayload,
            method: "POST"
        });
    }
    async triggerUpload(broadcastableId) {
        await this.#fetch(`broadcastables/${broadcastableId}/delivery`, {
            method: "POST",
            bodyJsonObject: {}
        });
        return Promise.resolve();
    }
    async acceptAndDeliver(broadcastableId, showId) {
        await this.accept(showId).then(async ()=>{
            await this.#fetch(`broadcastables/${broadcastableId}/delivery`, {
                method: "POST",
                bodyJsonObject: {}
            });
            return Promise.resolve();
        });
    }
    async deliverWithoutTranscoding(broadcastableId, targetOrgId) {
        const response = await this.#fetch(`broadcastables/${broadcastableId}/copyToOrganization`, {
            bodyJsonObject: {
                targetOrg: targetOrgId
            },
            method: "POST"
        });
        return response.json();
    }
    async copyToShow(broadcastableId, target, subtitles) {
        const response = await this.#fetch(`broadcastables/${broadcastableId}/copyToShow`, {
            bodyJsonObject: {
                target,
                subtitles
            },
            method: "POST"
        });
        return response.json();
    }
    async getManifest(proxyId) {
        const response = await this.#fetch(`files/${proxyId}/manifest`, {
            contentType: "application/xml"
        });
        return response.blob();
    }
    async getDeliverableOrgs() {
        const response = await this.#fetch(`organizations/deliverables`, {});
        return response.json();
    }
    async getFileSegments(materialId) {
        const response = await this.#fetch(`files/${materialId}/segments`, {});
        return response.json();
    }
    async getOrganizationDeliveries(orgId) {
        const response = await this.#fetch(`organizations/${orgId}/shows/deliveries`);
        return response.json();
    }
    async getFormats(orgId) {
        const response = await this.#fetch(`organizations/${orgId}/formats`, {});
        return response.json();
    }
    async getSubtitleFormats(orgId) {
        const response = await this.#fetch(`organizations/${orgId}/subtitleFormats`);
        return response.json();
    }
    setAudioMapping(fileId, mappingPayload) {
        return this.#fetch(`files/${fileId}/audioMapping`, {
            bodyJsonObject: mappingPayload,
            method: "POST"
        });
    }
    proxy(partialUrl, optionalArg) {
        return this.#fetch(partialUrl, optionalArg || {});
    }
    #fetch(partialUrl, optionalArg = {}) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", optionalArg.contentType ?? "application/json");
        if (this.#apiToken) {
            myHeaders.append("Authorization", `Bearer ${this.#apiToken}`);
            myHeaders.append("Cookie", `sessionJwt=${this.#apiToken}`);
        }
        const request = new Request(`${this.#contextSubDomain()}/v3/${partialUrl}`, {
            method: optionalArg.method ?? "GET",
            headers: myHeaders,
            body: optionalArg.bodyJsonObject === undefined ? null : JSON.stringify(optionalArg.bodyJsonObject),
            credentials: this.#context ? "include" : undefined
        });
        console.log(request.url);
        console.log(this.#contextSubDomain());
        console.log(this.#apiToken);
        console.log(myHeaders);
        return fetch(request).then(async (response)=>{
            if (response.ok) {
                return response;
            } else {
                throw await response.json();
            }
        });
    }
    #contextSubDomain() {
        if (this.#context) {
            const ctx = this.#context == "www" ? "app" : `app-${this.#context}`;
            return `https://${ctx}.nomalab.com`;
        } else {
            return "";
        }
    }
}
export { AlreadyPresentDeliverable as AlreadyPresentDeliverable };
export { Nomalab as Nomalab };
var BroadcastableKind;
(function(BroadcastableKind) {
    BroadcastableKind["Subtitle"] = "Subtitle";
    BroadcastableKind["Material"] = "Material";
    BroadcastableKind["Audio"] = "Audio";
    BroadcastableKind["Extra"] = "Extra";
})(BroadcastableKind || (BroadcastableKind = {}));
var Kind;
(function(Kind) {
    Kind["Create"] = "Create";
    Kind["Finish"] = "Finish";
    Kind["Request"] = "Request";
})(Kind || (Kind = {}));
var MXFVersion;
(function(MXFVersion) {
    MXFVersion["AsMaster"] = "AsMaster";
    MXFVersion["Vd"] = "VD";
    MXFVersion["Vo"] = "VO";
})(MXFVersion || (MXFVersion = {}));
var TranscodeKind;
(function(TranscodeKind) {
    TranscodeKind["Copy"] = "copy";
    TranscodeKind["Deliverable"] = "deliverable";
    TranscodeKind["ProxyLowRes"] = "proxy_low_res";
    TranscodeKind["ProxySubtitle"] = "proxy_subtitle";
})(TranscodeKind || (TranscodeKind = {}));
var NodeKind;
(function(NodeKind) {
    NodeKind["Season"] = "Season";
    NodeKind["Collection"] = "Collection";
    NodeKind["Episode"] = "Episode";
    NodeKind["Unitary"] = "Unitary";
})(NodeKind || (NodeKind = {}));
var ShowKind;
(function(ShowKind) {
    ShowKind["Delivery"] = "Delivery";
    ShowKind["Master"] = "Master";
})(ShowKind || (ShowKind = {}));
var EventEnum;
(function(EventEnum) {
    EventEnum["Ingest"] = "Ingest";
    EventEnum["Lifecycle"] = "Lifecycle";
    EventEnum["QualityCheck"] = "QualityCheck";
    EventEnum["Transcode"] = "Transcode";
})(EventEnum || (EventEnum = {}));
var BroadcastableFileKind;
(function(BroadcastableFileKind) {
    BroadcastableFileKind["ProxyManifest"] = "ProxyManifest";
    BroadcastableFileKind["ProxyDashVideo"] = "ProxyDashVideo";
    BroadcastableFileKind["ProxyAudio"] = "ProxyAudio";
    BroadcastableFileKind["ProxySubtitle"] = "ProxySubtitle";
    BroadcastableFileKind["VerificationReportPdf"] = "VerificationReportPdf";
    BroadcastableFileKind["VerificationReportXml"] = "VerificationReportXml";
    BroadcastableFileKind["Video"] = "Video";
    BroadcastableFileKind["Audio"] = "Audio";
    BroadcastableFileKind["Subtitle"] = "Subtitle";
    BroadcastableFileKind["Extra"] = "Extra";
})(BroadcastableFileKind || (BroadcastableFileKind = {}));
var FileTypeVideo;
(function(FileTypeVideo) {
    FileTypeVideo["Mxf"] = "Mxf";
    FileTypeVideo["Qtff"] = "Qtff";
    FileTypeVideo["Mp4"] = "Mp4";
})(FileTypeVideo || (FileTypeVideo = {}));
var FileTypeAudio;
(function(FileTypeAudio) {
    FileTypeAudio["Mp3"] = "Mp3";
})(FileTypeAudio || (FileTypeAudio = {}));
var Phase;
(function(Phase) {
    Phase["Waiting"] = "Waiting";
    Phase["Downloading"] = "Downloading";
    Phase["Encoding"] = "Encoding";
    Phase["Packaging"] = "Packaging";
    Phase["Uploading"] = "Uploading";
    Phase["Finished"] = "Finished";
})(Phase || (Phase = {}));
var State;
(function(State) {
    State["Active"] = "Active";
    State["Archived"] = "Archived";
    State["Restoring"] = "Restoring";
})(State || (State = {}));
export { BroadcastableKind as BroadcastableKind };
export { Kind as Kind };
export { MXFVersion as MXFVersion };
export { TranscodeKind as TranscodeKind };
export { NodeKind as NodeKind };
export { ShowKind as ShowKind };
export { EventEnum as EventEnum };
export { BroadcastableFileKind as BroadcastableFileKind };
export { FileTypeVideo as FileTypeVideo };
export { FileTypeAudio as FileTypeAudio };
export { Phase as Phase };
export { State as State };
var FormatSpec;
(function(FormatSpec) {
    FormatSpec["Mxf"] = "Mxf";
    FormatSpec["Mp4"] = "Mp4";
    FormatSpec["ProRes422"] = "ProRes422";
    FormatSpec["ProRes4444"] = "ProRes4444";
    FormatSpec["ADN"] = "ADN";
    FormatSpec["AVCIntra100"] = "AVCIntra100";
    FormatSpec["IMX50"] = "IMX50";
    FormatSpec["Mp4Salto"] = "Mp4Salto";
    FormatSpec["MovH264"] = "MovH264";
    FormatSpec["MovHevc"] = "MovHevc";
    FormatSpec["MxfProgressive"] = "MxfProgressive";
    FormatSpec["Demux"] = "Demux";
    FormatSpec["AudioExtract"] = "AudioExtract";
})(FormatSpec || (FormatSpec = {}));
var FormatAudioCodec;
(function(FormatAudioCodec) {
    FormatAudioCodec["PCMS24LE"] = "PCMS24LE";
    FormatAudioCodec["PCMS16LE"] = "PCMS16LE";
    FormatAudioCodec["PCMS24BE"] = "PCMS24BE";
    FormatAudioCodec["AAC"] = "AAC";
    FormatAudioCodec["MP3"] = "MP3";
    FormatAudioCodec["MOV_Conteneur"] = "MOV_Conteneur";
})(FormatAudioCodec || (FormatAudioCodec = {}));
var FormatSegmentKind;
(function(FormatSegmentKind) {
    FormatSegmentKind["Mire"] = "Mire";
    FormatSegmentKind["Black"] = "Black";
    FormatSegmentKind["Slate"] = "Slate";
    FormatSegmentKind["Video"] = "Video";
    FormatSegmentKind["Countdown"] = "Countdown";
})(FormatSegmentKind || (FormatSegmentKind = {}));
var SubtitleFileFormat;
(function(SubtitleFileFormat) {
    SubtitleFileFormat["STL"] = "STL";
    SubtitleFileFormat["WebVTT"] = "WebVTT";
    SubtitleFileFormat["SRT"] = "SRT";
})(SubtitleFileFormat || (SubtitleFileFormat = {}));
var SubtitleDisplayStandard;
(function(SubtitleDisplayStandard) {
    SubtitleDisplayStandard["Open"] = "Open";
    SubtitleDisplayStandard["Teletext1"] = "Teletext1";
    SubtitleDisplayStandard["Teletext2"] = "Teletext2";
})(SubtitleDisplayStandard || (SubtitleDisplayStandard = {}));
var SubtitleTypeVersion;
(function(SubtitleTypeVersion) {
    SubtitleTypeVersion["PARTIAL"] = "PARTIAL";
    SubtitleTypeVersion["COMPLETE"] = "COMPLETE";
    SubtitleTypeVersion["COMPLETE_WITHOUT_PARTIAL"] = "COMPLETE_WITHOUT_PARTIAL";
    SubtitleTypeVersion["SDH"] = "SDH";
})(SubtitleTypeVersion || (SubtitleTypeVersion = {}));
var SegmentLabel;
(function(SegmentLabel) {
    SegmentLabel["OpeningCredits"] = "OpeningCredits";
    SegmentLabel["EndingCredits"] = "EndingCredits";
    SegmentLabel["Introduction"] = "Introduction";
    SegmentLabel["Program"] = "Program";
    SegmentLabel["Trailer"] = "Trailer";
    SegmentLabel["Advertising"] = "Advertising";
    SegmentLabel["TestPattern"] = "TestPattern";
    SegmentLabel["Black"] = "Black";
    SegmentLabel["Slate"] = "Slate";
    SegmentLabel["NeutralBases"] = "NeutralBases";
    SegmentLabel["CustomDelivery"] = "CustomDelivery";
})(SegmentLabel || (SegmentLabel = {}));
var Version;
(function(Version) {
    Version["ARA"] = "ARA";
    Version["CHI"] = "CHI";
    Version["KOR"] = "KOR";
    Version["DAN"] = "DAN";
    Version["DUT"] = "DUT";
    Version["HEB"] = "HEB";
    Version["NLD"] = "NLD";
    Version["RUS"] = "RUS";
    Version["SWE"] = "SWE";
    Version["FRA"] = "FRA";
    Version["GER"] = "GER";
    Version["ITA"] = "ITA";
    Version["POR"] = "POR";
    Version["ENG"] = "ENG";
    Version["SPA"] = "SPA";
    Version["JPN"] = "JPN";
    Version["NOR"] = "NOR";
    Version["UKR"] = "UKR";
    Version["INT"] = "INT";
    Version["NOTHING"] = "";
})(Version || (Version = {}));
var Mapping;
(function(Mapping) {
    Mapping["AsMaster"] = "AsMaster";
    Mapping["NoSound"] = "NoSound";
    Mapping["VD"] = "VD";
    Mapping["VO"] = "VO";
    Mapping["VI"] = "VI";
    Mapping["VDVO"] = "VDVO";
    Mapping["VOAD"] = "VOAD";
    Mapping["VDAD"] = "VDAD";
    Mapping["VIVD"] = "VIVD";
    Mapping["VIVO"] = "VIVO";
    Mapping["VDVOAD"] = "VDVOAD";
    Mapping["VDVIVONLY"] = "VDVIVONLY";
    Mapping["VDVIMEVONLY"] = "VDVIMEVONLY";
})(Mapping || (Mapping = {}));
var Layout;
(function(Layout) {
    Layout["Mono"] = "Mono";
    Layout["DualMono"] = "DualMono";
    Layout["Stereo"] = "Stereo";
    Layout["StereoL"] = "StereoL";
    Layout["StereoR"] = "StereoR";
    Layout["FiveDotOne"] = "FiveDotOne";
    Layout["FiveDotOneL"] = "FiveDotOneL";
    Layout["FiveDotOneR"] = "FiveDotOneR";
    Layout["FiveDotOneC"] = "FiveDotOneC";
    Layout["FiveDotOneSL"] = "FiveDotOneSL";
    Layout["FiveDotOneSR"] = "FiveDotOneSR";
    Layout["FiveDotOneLFE"] = "FiveDotOneLFE";
    Layout["SevenDotOne"] = "SevenDotOne";
    Layout["OneTrack"] = "OneTrack";
})(Layout || (Layout = {}));
var TypeVersion;
(function(TypeVersion) {
    TypeVersion["ORIGINAL"] = "ORIGINAL";
    TypeVersion["DUBBED"] = "DUBBED";
    TypeVersion["AD"] = "AD";
    TypeVersion["MUTE"] = "MUTE";
    TypeVersion["INT"] = "INT";
    TypeVersion["ME"] = "ME";
    TypeVersion["VONLY"] = "VONLY";
})(TypeVersion || (TypeVersion = {}));
export { FormatSpec as FormatSpec };
export { FormatAudioCodec as FormatAudioCodec };
export { FormatSegmentKind as FormatSegmentKind };
export { SubtitleFileFormat as SubtitleFileFormat };
export { SubtitleDisplayStandard as SubtitleDisplayStandard };
export { SubtitleTypeVersion as SubtitleTypeVersion };
export { SegmentLabel as SegmentLabel };
export { Version as Version };
export { Mapping as Mapping };
export { Layout as Layout };
export { TypeVersion as TypeVersion };


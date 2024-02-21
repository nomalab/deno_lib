import {
  AudioMappingPayload,
  CopyToBroadcastable,
  DeliverableOrganization,
  Deliveries,
  DeliverPayload,
  DeliveryApi,
  Job,
  MeUser,
  Node,
  NodeClass,
  NodeKind,
  Organization,
  Segment,
  Show,
  ShowClass,
  ShowKind,
  ShowPath,
  SubtitleFormatApi,
  SubtitleFormats,
} from "./types.ts";
import { Format } from "./formats.ts";

export class AlreadyPresentDeliverable extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "Inaccessible";
  }
}
export class Nomalab {
  // both unset in the front-end
  #context?: string;
  #apiToken?: string;

  constructor(context?: string, apiToken?: string) {
    this.#context = context;
    this.#apiToken = apiToken;
  }

  async me(): Promise<MeUser> {
    const response = await this.#fetch(`users/me`);
    return response.json() as Promise<MeUser>;
  }

  async getShow(showUuid: string): Promise<Show> {
    const response = await this.#fetch(`shows/${showUuid}`);
    return response.json() as Promise<Show>;
  }

  async getRoots(organizationId: string): Promise<NodeClass[]> {
    const response = await this.#requestWithSwitch(
      organizationId,
      "hierarchy",
    );
    return response.json() as Promise<NodeClass[]>;
  }

  async createHierarchy(
    organizationId: string,
    name: string,
    kind: NodeKind,
    parent?: string,
  ): Promise<NodeClass> {
    const response = await this.#requestWithSwitch(
      organizationId,
      "hierarchy",
      {
        method: "POST",
        bodyJsonObject: {
          name,
          parent,
          kind,
        },
      },
    );
    return response.json() as Promise<NodeClass>;
  }

  async createShow(
    nodeId: string,
    name: string,
    kind: ShowKind,
  ): Promise<string> {
    const response = await this.#fetch(`hierarchy/${nodeId}/shows`, {
      method: "POST",
      bodyJsonObject: {
        name,
        kind,
      },
    });
    const { id } = await response.json() as ShowClass;
    return id;
  }

  async #requestWithSwitch(
    organizationId: string,
    partialUrl: string,
    optionalArg: {
      method?: string;
      bodyJsonObject?: unknown;
      contentType?: string;
      cookieHeader?: Record<string, string>;
    } = {},
  ): Promise<Response> {
    const response = await this.#fetch(
      `users/switch`,
      {
        bodyJsonObject: { organization: organizationId },
        method: "POST",
      },
    );

    if (this.#apiToken && response.headers.has("set-cookie")) {
      response.headers.getSetCookie().forEach((sc) => {
        const [name, value, ..._xs] = sc.split(";")[0]?.split("=");
        if (name == "sessionJwt") {
          this.#apiToken = value;
        }
      });
    }

    // To avoid leak since we don't use the body of the response
    await response.body?.cancel();

    return this.#fetch(
      partialUrl,
      optionalArg,
    );
  }

  async getChildren(nodeUuid: string): Promise<NodeClass[]> {
    const response = await this.#fetch(`hierarchy/${nodeUuid}/children`, {});
    return response.json() as Promise<NodeClass[]>;
  }

  async getDeliveries(): Promise<Deliveries> {
    const response = await this.#fetch(`shows/deliveries`, {});
    return response.json() as Promise<Deliveries>;
  }

  async getNode(nodeUuid: string): Promise<Node> {
    const response = await this.#fetch(`hierarchy/${nodeUuid}`, {});
    return response.json() as Promise<Node>;
  }

  async getShowsForNode(nodeUuid: string): Promise<ShowClass[]> {
    const response = await this.#fetch(`hierarchy/${nodeUuid}/shows`, {});
    return response.json() as Promise<ShowClass[]>;
  }

  async getPath(showUuid: string): Promise<ShowPath[]> {
    const response = await this.#fetch(
      `admin/shows/path`,
      {
        bodyJsonObject: { showIds: [showUuid] },
        method: "POST",
      },
    );
    return response.json() as Promise<ShowPath[]>;
  }

  async getOrganizations(): Promise<Organization[]> {
    const response = await this.#fetch(`organizations`, {});
    return response.json() as Promise<Organization[]>;
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    const organisation = (await this.getOrganizations()).filter((org) => {
      return org.id == organizationId;
    });
    if (organisation.length == 0) {
      return Promise.reject(`Org ${organizationId} not found`);
    }
    return Promise.resolve(organisation[0]);
  }

  async getOrganizationByName(organizationName: string): Promise<Organization> {
    const organisation = (await this.getOrganizations()).filter((org) => {
      return org.name == organizationName;
    });
    if (organisation.length == 0) {
      return Promise.reject(`Org ${organizationName} not found`);
    }
    return Promise.resolve(organisation[0]);
  }

  async getJob(jobUuid: string): Promise<Job> {
    const response = await this.#fetch(`jobs/${jobUuid}`, {});
    return response.json() as Promise<Job>;
  }

  async getSegments(fileId: string): Promise<Segment[]> {
    const response = await this.#fetch(`files/${fileId}/segments`, {});
    return response.json() as Promise<Segment[]>;
  }

  async s3Upload(payload: CopyToBroadcastable): Promise<void> {
    const url = payload.destRole ? "aws/copyFromExt" : "aws/copy";
    await this.#fetch(
      url,
      {
        bodyJsonObject: payload,
        method: "POST",
      },
    );

    return Promise.resolve();
  }

  async accept(showId: string): Promise<ShowClass> {
    const response = await this.#fetch(
      `shows/${showId}/accept`,
      { method: "POST" },
    );
    return response.json() as Promise<ShowClass>;
  }

  // Deliver with starting a transcode
  deliver(
    broadcastableId: string,
    deliverPayload: DeliverPayload,
  ): Promise<Response> {
    return this.#fetch(
      `broadcastables/${broadcastableId}/deliver`,
      {
        bodyJsonObject: deliverPayload,
        method: "POST",
      },
    ) as Promise<Response>;
  }

  async triggerUpload(broadcastableId: string) {
    await this.#fetch(
      `broadcastables/${broadcastableId}/delivery`,
      { method: "POST", bodyJsonObject: {} },
    );
    return Promise.resolve() as Promise<void>;
  }

  // Accept the show and then trigger the upload (delivery bad naming tho)
  async acceptAndDeliver(
    broadcastableId: string,
    showId: string,
  ): Promise<void> {
    await this.accept(showId).then(async () => {
      await this.#fetch(
        `broadcastables/${broadcastableId}/delivery`,
        { method: "POST", bodyJsonObject: {} },
      );
      return Promise.resolve();
    });
  }

  async deliverWithoutTranscoding(
    broadcastableId: string,
    targetOrgId: string,
  ): Promise<ShowClass> {
    const response = await this.#fetch(
      `broadcastables/${broadcastableId}/copyToOrganization`,
      {
        bodyJsonObject: { targetOrg: targetOrgId },
        method: "POST",
      },
    );
    return response.json() as Promise<ShowClass>;
  }

  async copyToShow(
    broadcastableId: string,
    target: string,
    subtitles?: SubtitleFormatApi,
  ): Promise<ShowClass> {
    const response = await this.#fetch(
      `broadcastables/${broadcastableId}/copyToShow`,
      {
        bodyJsonObject: { target, subtitles },
        method: "POST",
      },
    );
    return response.json() as Promise<ShowClass>;
  }

  async getManifest(proxyId: string): Promise<Blob> {
    const response = await this.#fetch(
      `files/${proxyId}/manifest`,
      {
        contentType: "application/xml",
      },
    );
    return response.blob() as Promise<Blob>;
  }

  async getDeliverableOrgs() {
    const response = await this.#fetch(`organizations/deliverables`, {});
    return response.json() as Promise<DeliverableOrganization[]>;
  }

  async getSubtitleFormatsList(): Promise<SubtitleFormats> {
    const response = await this.#fetch(`subtitleFormats`, {});
    return response.json() as Promise<SubtitleFormats>;
  }

  #throwError(message: string, response: Response): void {
    console.error(message);
    console.error(response);
    throw new Error(message);
  }

  async getFileSegments(materialId: string) {
    const response = await this.#fetch(`files/${materialId}/segments`, {});
    return response.json() as Promise<Segment[]>;
  }

  async getOrganizationDeliveries(orgId: string) {
    const response = await this.#fetch(
      `organizations/${orgId}/shows/deliveries`,
    );
    return response.json() as Promise<DeliveryApi>;
  }

  async getFormats(orgId: string) {
    const response = await this.#fetch(`organizations/${orgId}/formats`, {});
    return response.json() as Promise<Format[]>;
  }

  async getSubtitleFormats(orgId: string) {
    const response = await this.#fetch(
      `organizations/${orgId}/subtitleFormats`,
    );
    return response.json() as Promise<SubtitleFormatApi[]>;
  }

  setAudioMapping(
    fileId: string,
    mappingPayload: AudioMappingPayload,
  ): Promise<Response> {
    return this.#fetch(
      `files/${fileId}/audioMapping`,
      {
        bodyJsonObject: mappingPayload,
        method: "POST",
      },
    );
  }

  proxy(
    partialUrl: string,
    optionalArg?: {
      method?: string;
      bodyJsonObject?: unknown;
      contentType?: string;
      cookieHeader?: Record<string, string>;
    },
  ): Promise<Response> {
    return this.#fetch(partialUrl, optionalArg || {});
  }

  #fetch(
    partialUrl: string,
    optionalArg: {
      method?: string;
      bodyJsonObject?: unknown;
      contentType?: string;
      cookieHeader?: Record<string, string>;
    } = {},
  ): Promise<Response> {
    const myHeaders = new Headers();
    myHeaders.append(
      "Content-Type",
      optionalArg.contentType ?? "application/json",
    );

    if (this.#apiToken) {
      myHeaders.append("Authorization", `Bearer ${this.#apiToken}`);
      myHeaders.append(
        "Cookie",
        `sessionJwt=${this.#apiToken}`,
      );
    }

    const request = new Request(
      `${this.#contextSubDomain()}/v3/${partialUrl}`,
      {
        method: optionalArg.method ?? "GET",
        headers: myHeaders,
        body: (optionalArg.bodyJsonObject === undefined)
          ? null
          : JSON.stringify(optionalArg.bodyJsonObject),
        credentials: this.#context ? "include" : undefined,
      },
    );

    console.log(request.url);
    console.log(this.#contextSubDomain());
    console.log(this.#apiToken);
    console.log(myHeaders);

    return fetch(request).then(async (response) => {
      if (response.ok) {
        return response;
      } else {
        throw (await response.json());
      }
    });
  }

  #contextSubDomain(): string {
    if (this.#context) {
      const ctx = this.#context == "www" ? "app" : `app-${this.#context}`;
      return `https://${ctx}.nomalab.com`;
    } else {
      // front-end just wants to keep its own context
      return "";
    }
  }
}

declare global {
  interface Headers {
    getSetCookie(): string[];
  }
}

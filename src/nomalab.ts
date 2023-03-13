import {
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
  Path,
  Segment,
  Show,
  ShowClass,
  ShowKind,
  SubtitleFormat,
} from "./types.ts";
import { Format } from "./formats.ts";
import { assert, getSetCookies } from "./deps.ts";

export class AlreadyPresentDeliverable extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "Inaccessible";
  }
}
export class Nomalab {
  #context: string;
  #apiToken: string;

  constructor(context: string, apiToken: string) {
    this.#context = context;
    this.#apiToken = apiToken;
  }

  async me(): Promise<MeUser> {
    const response = await this.#fetch(`users/me`, {});
    if (!response.ok) {
      this.#throwError(`ERROR - Can't load user infos.`, response);
    }
    return response.json() as Promise<MeUser>;
  }

  async getShow(showUuid: string): Promise<Show> {
    const response = await this.#fetch(`shows/${showUuid}`, {});
    if (!response.ok) {
      this.#throwError(
        `ERROR - Can't find show with id ${showUuid}.`,
        response,
      );
    }
    return response.json() as Promise<Show>;
  }

  async getRoots(organizationId: string): Promise<NodeClass[]> {
    const response = await this.#requestWithSwitch(
      organizationId,
      "hierarchy",
      {},
    );
    if (!response.ok) this.#throwError(`ERROR - Can't find root.`, response);
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
    if (!response.ok) {
      this.#throwError(`ERROR - Can't create ${kind} ${name}.`, response);
    }
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

    if (!response.ok) {
      this.#throwError(`ERROR - Can't create show ${kind} ${name}.`, response);
    }
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
    },
  ): Promise<Response> {
    const response = await this.#fetch(
      `users/switch`,
      {
        bodyJsonObject: { organization: organizationId },
        method: "POST",
      },
    );
    if (!response.ok) {
      this.#throwError(`Can't switch to org ${organizationId}`, response);
    }

    const setCookie = getSetCookies(response.headers)[0];
    assert(setCookie, "No cookie");
    this.#apiToken = setCookie.value;

    // To avoid leak since we don't use the body of the response
    await response.body?.cancel();
    return this.#fetch(partialUrl, optionalArg);
  }

  async getChildren(nodeUuid: string): Promise<NodeClass[]> {
    const response = await this.#fetch(`hierarchy/${nodeUuid}/children`, {});
    if (!response.ok) {
      this.#throwError(
        `ERROR - Can't find children with id ${nodeUuid}.`,
        response,
      );
    }
    return response.json() as Promise<NodeClass[]>;
  }

  async getDeliveries(): Promise<Deliveries> {
    const response = await this.#fetch(`shows/deliveries`, {});
    if (!response.ok) {
      if (response.status == 409) {
        throw new AlreadyPresentDeliverable(
          "Can't deliver because of an already present deliverable.",
        );
      } else {
        this.#throwError(`ERROR - Can't get deliveries.`, response);
      }
    }
    return response.json() as Promise<Deliveries>;
  }

  async getNode(nodeUuid: string): Promise<Node> {
    const response = await this.#fetch(`hierarchy/${nodeUuid}`, {});
    if (!response.ok) {
      this.#throwError(
        `ERROR - Can't find node with id ${nodeUuid}.`,
        response,
      );
    }
    return response.json() as Promise<Node>;
  }

  async getShowsForNode(nodeUuid: string): Promise<ShowClass[]> {
    const response = await this.#fetch(`hierarchy/${nodeUuid}/shows`, {});
    if (!response.ok) {
      this.#throwError(
        `ERROR - error when retrieving shows for node ${nodeUuid}.`,
        response,
      );
    }
    return response.json() as Promise<ShowClass[]>;
  }

  async getPath(showUuid: string): Promise<Path[]> {
    const response = await this.#fetch(
      `admin/shows/path`,
      {
        bodyJsonObject: { showIds: [showUuid] },
        method: "POST",
      },
    );
    if (!response.ok) {
      this.#throwError(
        `ERROR - Can't find show with id ${showUuid}.`,
        response,
      );
    }
    return response.json() as Promise<Path[]>;
  }

  async getOrganizations(): Promise<Organization[]> {
    const response = await this.#fetch(`organizations`, {});
    if (!response.ok) {
      this.#throwError(`ERROR - Can't get organizations.`, response);
    }
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

  async jobs(organizationId: string): Promise<Job[]> {
    const response = await this.#fetch(
      `organizations/${organizationId}/jobs`,
      {},
    );
    if (!response.ok) {
      this.#throwError(
        `ERROR - Can't find jobs for organisation id ${organizationId}.`,
        response,
      );
    }
    return response.json() as Promise<Job[]>;
  }

  async getJob(jobUuid: string): Promise<Job> {
    const response = await this.#fetch(`jobs/${jobUuid}`, {});
    if (!response.ok) {
      this.#throwError(`ERROR - Can't find job with id ${jobUuid}.`, response);
    }
    return response.json() as Promise<Job>;
  }

  async s3Upload(payload: CopyToBroadcastable): Promise<void> {
    const url = payload.destRole ? "aws/copyFromExt" : "aws/copy";
    const response = await this.#fetch(
      url,
      {
        bodyJsonObject: payload,
        method: "POST",
      },
    );
    if (!response.ok) {
      console.log("[S3 UPLOAD]", "url:", url, "payload:", payload);
      this.#throwError(`ERROR - Can't make a s3 copy with payload.`, response);
    }
    return Promise.resolve();
  }

  async accept(showId: string): Promise<ShowClass> {
    const response = await this.#fetch(
      `shows/${showId}/accept`,
      { method: "POST" },
    );
    if (!response.ok) {
      this.#throwError(`ERROR - Can't accept show. ${showId}`, response);
    }
    return response.json() as Promise<ShowClass>;
  }

  // Deliver with starting a transcode
  async deliver(showId: string, deliverPayload: DeliverPayload): Promise<void> {
    const response = await this.#fetch(
      `broadcastables/${showId}/deliver`,
      {
        bodyJsonObject: deliverPayload,
        method: "POST",
      },
    );
    if (!response.ok) {
      if (response.status == 409) {
        throw new AlreadyPresentDeliverable(
          "Can't deliver because of an already present deliverable.",
        );
      } else {
        this.#throwError(`ERROR - Can't deliver with payload.`, response);
      }
    }
    return Promise.resolve() as Promise<void>;
  }

  async triggerUpload(broadcastableId: string) {
    const response = await this.#fetch(
      `broadcastables/${broadcastableId}/delivery`,
      { method: "POST", bodyJsonObject: {} },
    );
    if (!response.ok) {
      if (response.status == 409) {
        throw new AlreadyPresentDeliverable(
          "Can't deliver because of an already present deliverable.",
        );
      } else {
        this.#throwError(`ERROR - Can't deliver show.`, response);
      }
    }
    return Promise.resolve() as Promise<void>;
  }

  // Accept the show and then trigger the upload (delivery bad naming tho)
  async acceptAndDeliver(
    broadcastableId: string,
    showId: string,
  ): Promise<void> {
    await this.accept(showId).then(async () => {
      const response = await this.#fetch(
        `broadcastables/${broadcastableId}/delivery`,
        { method: "POST", bodyJsonObject: {} },
      );
      if (!response.ok) {
        if (response.status == 409) {
          throw new AlreadyPresentDeliverable(
            "Can't deliver because of an already present deliverable.",
          );
        } else {
          this.#throwError(
            `ERROR - Can't accept and deliver show. [${showId}]`,
            response,
          );
        }
      }
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
    if (!response.ok) {
      if (response.status == 409) {
        throw new AlreadyPresentDeliverable(
          "Can't deliver because of an already present deliverable.",
        );
      } else {
        this.#throwError(
          `ERROR - Can't deliver without transcoding to org id <${targetOrgId}>`,
          response,
        );
      }
    }
    return response.json() as Promise<ShowClass>;
  }

  async getManifest(proxyId: string): Promise<Blob> {
    const response = await this.#fetch(
      `files/${proxyId}/manifest`,
      {
        contentType: "application/xml",
      },
    );
    if (!response.ok) {
      this.#throwError(
        `ERROR - Can't find manifest with proxyId ${proxyId}.`,
        response,
      );
    }
    return response.blob() as Promise<Blob>;
  }

  async getDeliverableOrgs() {
    const response = await this.#fetch(`organizations/deliverables`, {});
    return response.json() as Promise<DeliverableOrganization[]>;
  }

  async getFileSegments(materialId: string) {
    const response = await this.#fetch(`files/${materialId}/segments`, {});
    return response.json() as Promise<Segment[]>;
  }

  async getOrganizationDeliveries(orgId: string) {
    const response = await this.#fetch(
      `organizations/${orgId}/shows/deliveries`,
      {},
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
      {},
    );
    return response.json() as Promise<SubtitleFormat[]>;
  }

  #throwError(message: string, response: Response): void {
    console.error(message);
    console.error(response);
    throw new Error(message);
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
    },
  ): Promise<Response> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", optionalArg.contentType ?? "application/json");
    myHeaders.append("Cookie", `sessionJwt=${this.#apiToken}`);
    // myHeaders.append("Authorization", `Bearer ${this.#apiToken} `);
    // if (optionalArg.cookieHeader) {
    //   myHeaders.append("Cookie", `sessionJwt=${optionalArg.cookieHeader["sessionJwt"]}`)
    // }
    const request = new Request(
      `https://${this.#contextSubDomain()}.nomalab.com/v3/${partialUrl}`,
      {
        method: optionalArg.method ?? "GET",
        headers: myHeaders,
        body: (optionalArg.bodyJsonObject === undefined) ? null : JSON.stringify(optionalArg.bodyJsonObject),
        credentials: "include",
      },
    );
    return fetch(request);
  }
  #contextSubDomain(): string {
    if (this.#context == "www") return "app";
    else {
      return `app-${this.#context}`;
    }
  }
}

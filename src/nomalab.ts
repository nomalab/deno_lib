import { CopyToBroadcastable, Job, Organization, Path, Show, ShowClass, Node, NodeClass } from "./types.ts";
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

  async getShow(showUuid: string): Promise<Show> {
    const response = await fetch(
      this.#createRequest(`shows/${showUuid}`),
    );
    return this.#handleResponse<Show>(
      response,
      `ERROR - Can't find show with id ${showUuid}.`,
    );
  }
  async getChildren(nodeUuid:string): Promise<NodeClass[]>{
    const response = await fetch(
      this.#createRequest(`hierarchy/${nodeUuid}/children`),
    );
    return this.#handleResponse<NodeClass[]>(
      response,
      `ERROR - Can't find children with id ${nodeUuid}.`,
    );
  }
  async getNode(nodeUuid: string): Promise<Node> {
    const response = await fetch(
      this.#createRequest(`hierarchy/${nodeUuid}`),
    );
    return this.#handleResponse<Node>(
      response,
      `ERROR - Can't find node with id ${nodeUuid}.`,
    );
  }
  async getShowsForNode(nodeUuid: string): Promise<ShowClass[]> {
    const response = await fetch(
      this.#createRequest(`hierarchy/${nodeUuid}/shows`),
    );
    return this.#handleResponse<ShowClass[]>(
      response,
      `ERROR - error when retrieving shows for node ${nodeUuid}.`,
    );
  }
  async getPath(showUuid: string): Promise<Path[]> {
    const response = await fetch(
      this.#createPostRequest(`admin/shows/path`, { showIds: [showUuid] }),
    );
    return this.#handleResponse<Path[]>(
      response,
      `ERROR - Can't find show with id ${showUuid}.`,
    );
  }
  async getOrganizations(): Promise<Organization[]> {
    const response = await fetch(
      this.#createRequest(`organizations`),
    );
    return this.#handleResponse<Organization[]>(
      response,
      `ERROR - Can't get organizations.`,
    );
  }
  async getJob(jobUuid: string): Promise<Job> {
    const response = await fetch(
      this.#createRequest(`jobs/${jobUuid}`),
    );
    return this.#handleResponse<Job>(
      response,
      `ERROR - Can't find show with id ${jobUuid}.`,
    );
  }
  async s3Upload(payload: CopyToBroadcastable): Promise<void> {
    const response = await fetch(this.#createPostRequest("aws/copy", payload));
    return this.#handleResponse<void>(
      response,
      `Error - Can't make a s3 copy with payload.${payload}`,
    );
  }

 async accept(showId: string): Promise<ShowClass> {
    const response = await fetch(this.#createPostRequest(`shows/${showId}/accept`, {}));
    return this.#handleResponse<ShowClass>(
      response,
      `Error - Can't accept show. ${showId}`,
    );
  }

  async deliverWithoutTranscoding(
    broadcastableId: string,
    targetOrgId: string,
  ): Promise<ShowClass> {
    const response = await fetch(
      this.#createPostRequest(
        `broadcastables/${broadcastableId}/copyToOrganization`,
        { targetOrg: targetOrgId },
      ),
    );
    return this.#handleResponse<ShowClass>(
      response,
      `Error - Can't deliver without transcoding to org id <${targetOrgId}>`,
    );
  }

  #handleResponse<Type>(
    response: Response,
    message: string,
  ): Promise<Type> {
    if (!response.ok) {
      if (response.status == 409) {
        throw new AlreadyPresentDeliverable(
          "Can't deliver because of an already present deliverable.",
        );
      } else {
        this.#throwError(message, response);
      }
    }
    // NOCONTENT
    if (response.status == 204) {
      return Promise.resolve({}) as Promise<Type>;
    } else {
      return response.json() as Promise<Type>;
    }
  }
  #throwError(message: string, response: Response): void {
    console.error(message);
    console.error(response);
    throw new Error(message);
  }
  #createPostRequest(partialUrl: string, bodyJsonObject: unknown): Request {
    return this.#createRequest(partialUrl, "POST", bodyJsonObject);
  }
  #createRequest(
    partialUrl: string,
    method = "GET",
    bodyJsonObject?: unknown,
  ): Request {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${this.#apiToken} `);
    const request = new Request(
      `https://${this.#contextSubDomain()}.nomalab.com/v3/${partialUrl}`,
      {
        method: method ?? "GET",
        headers: myHeaders,
        body: (bodyJsonObject == undefined) ? null : JSON.stringify(bodyJsonObject),
      },
    );
    return request;
  }
  #contextSubDomain(): string {
    if (this.#context == "www") return "app";
    else {
      return `app-${this.#context}`;
    }
  }
}

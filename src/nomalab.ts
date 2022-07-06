import { CopyToBroadcastable, Job, Path, Show } from "./types.ts";

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
  async getPath(showUuid: string): Promise<Path[]> {
    const response = await fetch(
      this.#createPostRequest(`admin/shows/path`, { showIds: [showUuid] }),
    );
    return this.#handleResponse<Path[]>(
      response,
      `ERROR - Can't find show with id ${showUuid}.`,
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
  async #handleResponse<Type>(
    response: Response,
    message: string,
  ): Promise<Type> {
    if (!response.ok) {
      if (response.status == 409) {
        console.log(
          "Can't deliver because of an already present deliverable.",
        );
      } else {
        await this.#throwError(message, response);
      }
    }
    return response.json() as Promise<Type>;
  }
  #throwError(message: string, response: Response) {
    console.error(message);
    console.error(response);
    throw new Error(message);
  }
  #createPostRequest(partialUrl: string, bodyJsonObject: unknown) {
    return this.#createRequest(partialUrl, "POST", bodyJsonObject);
  }
  #createRequest(
    partialUrl: string,
    method = "GET",
    bodyJsonObject?: unknown,
  ) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${this.#apiToken} `);
    const request = new Request(
      `https://${this.#contextSubDomain()}.nomalab.com/v3/${partialUrl}`,
      {
        method: method ?? "GET",
        headers: myHeaders,
        body: (bodyJsonObject == undefined)
          ? null
          : JSON.stringify(bodyJsonObject),
      },
    );
    return request;
  }
  #contextSubDomain() {
    if (this.#context == "www") return "app";
    else {
      return `app-${this.#context}`;
    }
  }
}

import axios, { AxiosInstance } from "axios";

export const CRAWLER_USER_AGENT = "sub-rehab-crawler/1.0.0";
export const CRAWLER_ATTRIB_URL = "https://sub.rehab";
export const AXIOS_REQUEST_TIMEOUT = 10 * 1000;

export class AxiosClient {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      timeout: AXIOS_REQUEST_TIMEOUT,
      headers: {
        "User-Agent": CRAWLER_USER_AGENT,
        "X-Lemmy-SiteUrl": CRAWLER_ATTRIB_URL,
      },
    });
  }

  async get(url: string, options = {}) {
    try {
      return await this.client.get(url, options);
    } catch (e: any) {
      if (e.response && e.response.data) {
        throw new Error(`Failed to get url ${url}: ${e.message}\n${e.response.data}`);
      }

      throw new Error(`Failed to get url ${url}: ${e.message}\n${e.response}`);
    }
  }
}

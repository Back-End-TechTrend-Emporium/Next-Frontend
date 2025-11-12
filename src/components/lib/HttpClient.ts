// src/lib/HttpClient.ts
import axios, { type AxiosInstance } from "axios";

export class HttpClient {
  private static _instance: HttpClient | null = null;
  private client: AxiosInstance;

  private constructor() {
    const rawBase = (process.env.NEXT_PUBLIC_API_URL as string) || "";
    const base = rawBase.replace(/\/+$/, "") || undefined;

    this.client = axios.create({
      baseURL: base,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
      withCredentials: true,
    });

    this.client.interceptors.request.use((config) => {
      try {
        const t =
          localStorage.getItem("jwt_token") ||
          localStorage.getItem("tte_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("access_token");
        if (t) config.headers = { ...(config.headers || {}), Authorization: t.startsWith("Bearer ") ? t : `Bearer ${t}` } as any;
      } catch {}
      return config;
    });

    this.client.interceptors.response.use((r) => r, (e) => Promise.reject(e));
  }

  static get instance(): AxiosInstance {
    if (!HttpClient._instance) {
      HttpClient._instance = new HttpClient();
    }
    return HttpClient._instance.client;
  }
}

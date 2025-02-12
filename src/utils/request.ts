type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Headers = Record<string, string>;

interface ApiOptions<InputType> {
  route: string;
  method: HttpMethod;
  body?: InputType;
  token?: string;
  addHeaders?: {
    [headerTitle: string]: string
  };
  externalLink?: string;
}

const API_URL = "https://api.p2p.org/api/v1";

export async function makeRequest<InputType, OutputType>({
  route,
  method,
  body,
  addHeaders,
  token = import.meta.env.VITE_P2P_KEY,
  externalLink,
}: ApiOptions<InputType>): Promise<OutputType> {
  try {
    let headers: Headers = {
      "Content-Type": "application/json",
    };
    headers = {...headers, ...addHeaders};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fetchParams: RequestInit = {
      method,
      headers,
    };

    if (method !== "GET" && body) {
      fetchParams.body = JSON.stringify(body);
    }

    const response = await fetch(externalLink || `${API_URL}${route}`, fetchParams);

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

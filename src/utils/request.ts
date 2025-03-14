type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Headers = Record<string, string>;

interface ApiOptions<InputType> {
  route: string;
  method: HttpMethod;
  body?: InputType;
  token?: string;
  addHeaders?: {
    [headerTitle: string]: string;
  };
  externalLink?: string;
}

const API_URL = "https://partners.mewapi.io/p2p";

export async function makeRequest<InputType, OutputType>({
  route,
  method,
  body,
  addHeaders,
  externalLink,
}: ApiOptions<InputType>): Promise<OutputType> {
  try {
    let headers: Headers = {
      "Content-Type": "application/json",
    };
    headers = { ...headers, ...addHeaders };

    const fetchParams: RequestInit = {
      method,
      headers,
    };

    if (method !== "GET" && body) {
      fetchParams.body = JSON.stringify(body);
    }

    const response = await fetch(
      externalLink || `${API_URL}${route}`,
      fetchParams
    );

    if (response.status === 524) {
      console.error("API request timed out (524)");
      throw new Error("API request timed out (524)");
    }

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

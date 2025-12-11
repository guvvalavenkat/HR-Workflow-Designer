export interface ApiClientConfig {
  baseUrl?: string;
}

const defaultConfig: ApiClientConfig = {
  baseUrl: '/api',
};

export const apiClient = (config: ApiClientConfig = defaultConfig) => {
  const baseUrl = config.baseUrl ?? defaultConfig.baseUrl;

  const get = async <T>(path: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  };

  return { get };
};


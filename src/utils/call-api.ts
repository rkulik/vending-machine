import { FetchError } from '@vending-machine/errors/fetch-error';

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    const error = new FetchError(response.statusText);
    error.info = await response.json();
    error.status = response.status;

    throw error;
  }

  return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callApi = async <T>(endpoint: string, payload?: any, method?: string): Promise<T> =>
  fetcher(
    endpoint,
    payload && {
      method: method ?? 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

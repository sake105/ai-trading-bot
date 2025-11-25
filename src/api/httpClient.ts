
import { API_BASE_URL } from '../config/env';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function httpGet<T>(path: string): Promise<T> {
  // In a real scenario, this hits the backend. 
  // For this demo, we route to backendApi logic immediately if mocking is handled there.
  // But the PDF architecture implies this is a generic fetcher.
  // We will simulate the network call here if we are in mock mode (handled in backendApi).
  // If we strictly follow PDF, this just fetches.
  
  // NOTE: Because we don't have a real Python backend running at localhost:8000 for this CodeSandbox,
  // this httpGet is effectively a placeholder. The real logic happens in backendApi.ts
  // which decides whether to call this or use Mocks.
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<T>(res);
}

export async function httpPost<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

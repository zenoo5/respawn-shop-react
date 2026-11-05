// Fetch and decode JSON with consistent HTTP, network, and response errors.
export const BASE_URL = (import.meta.env?.VITE_API_BASE_URL ?? '').replace(
  /\/+$/,
  '',
);

export class ApiError extends Error {
  // Retain the HTTP status; zero means no HTTP response was received.
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Narrow JSON objects before inspecting error messages or response fields.
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Require a decoder so the generic return type is validated rather than asserted.
export async function fetchJson<T>(
  path: string,
  decode: (value: unknown) => T,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    const headers = new Headers(options.headers);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    response = await fetch(BASE_URL + path, { ...options, headers });
  } catch {
    throw new ApiError(
      0,
      'The API could not be reached. Check your connection and try again.',
    );
  }
  if (!response.ok) {
    let message = 'Request failed (HTTP ' + response.status + ').';
    try {
      const error: unknown = await response.json();
      if (isRecord(error) && typeof error.error === 'string')
        message = error.error;
    } catch {
      // An HTML or empty error body must not hide its HTTP status.
    }
    throw new ApiError(response.status, message);
  }
  let value: unknown;
  try {
    value = await response.json();
  } catch {
    throw new ApiError(response.status, 'The API returned invalid JSON.');
  }
  try {
    return decode(value);
  } catch {
    throw new ApiError(response.status, 'The API returned invalid data.');
  }
}

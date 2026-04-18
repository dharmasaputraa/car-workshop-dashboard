/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataProvider } from "@refinedev/core";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "./constants";

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor: attach Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle 401 unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ---- JSON:API Deserializer ----

interface JsonApiResource {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
  relationships?: Record<
    string,
    {
      data?: { id: string; type: string } | { id: string; type: string }[];
    }
  >;
  meta?: Record<string, unknown>;
}

interface JsonApiResponse {
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
  meta?: Record<string, unknown>;
}

/**
 * Deserialize a single JSON:API resource into a flat object.
 * Merges id, type, attributes, and resolves relationships from included.
 */
const deserializeResource = (
  resource: JsonApiResource,
  includedMap: Map<string, JsonApiResource>,
  visited: Set<string> = new Set(),
): Record<string, unknown> => {
  // Prevent infinite recursion
  const cacheKey = `${resource.type}:${resource.id}`;
  if (visited.has(cacheKey)) {
    return { id: resource.id, type: resource.type };
  }
  visited.add(cacheKey);

  const result: Record<string, unknown> = {
    id: resource.id,
    type: resource.type,
    ...resource.attributes,
  };

  // Resolve relationships
  if (resource.relationships) {
    for (const [relName, relData] of Object.entries(resource.relationships)) {
      if (!relData.data) continue;

      if (Array.isArray(relData.data)) {
        // Has-many relationship
        result[relName] = relData.data
          .map((relItem) => {
            const includedItem = includedMap.get(
              `${relItem.type}:${relItem.id}`,
            );
            if (includedItem) {
              return deserializeResource(includedItem, includedMap, visited);
            }
            return { id: relItem.id, type: relItem.type };
          })
          .filter(Boolean);
      } else {
        // Has-one relationship
        // Also extract the foreign key (e.g., "owner" -> "owner_id")
        // so forms can pre-select the correct value
        result[`${relName}_id`] = relData.data.id;

        const includedItem = includedMap.get(
          `${relData.data.type}:${relData.data.id}`,
        );
        if (includedItem) {
          result[relName] = deserializeResource(
            includedItem,
            includedMap,
            visited,
          );
        } else {
          result[relName] = {
            id: relData.data.id,
            type: relData.data.type,
          };
        }
      }
    }
  }

  return result;
};

/**
 * Build a lookup map from the included array: "type:id" -> resource
 */
const buildIncludedMap = (
  included?: JsonApiResource[],
): Map<string, JsonApiResource> => {
  const map = new Map<string, JsonApiResource>();
  if (included) {
    for (const item of included) {
      map.set(`${item.type}:${item.id}`, item);
    }
  }
  return map;
};

/**
 * Deserialize a full JSON:API response (list or single)
 */
const deserializeResponse = (response: JsonApiResponse) => {
  const includedMap = buildIncludedMap(response.included);

  if (Array.isArray(response.data)) {
    return response.data.map((item) => deserializeResource(item, includedMap));
  }

  return deserializeResource(response.data, includedMap);
};

// ---- Helper: build query string ----

const buildQueryString = (params: Record<string, unknown>): string => {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
};

// ---- Data Provider ----
// NOTE: We use `as any` for return data because Refine's DataProvider generic
// typing requires TData compatibility that can't be satisfied with static casts.
// This is the same pattern used in Refine's official data provider packages.

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const params: Record<string, unknown> = {};

    // Pagination: API is 1-indexed
    const pag = pagination as
      | { currentPage?: number; pageSize?: number; mode?: string }
      | undefined;
    if (pag?.mode !== "off") {
      params["page"] = pag?.currentPage ?? 1;
      params["per_page"] = pag?.pageSize ?? 15;
    }

    // Sorting
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      params["sort"] = sorter.field;
      params["order"] = sorter.order;
    }

    // Filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter) {
          // Support for multiple operators
          if (filter.operator === "eq" || filter.operator === "contains") {
            params[`filter[${filter.field}]`] = filter.value;
          }
        }
      });
    }

    // Include relationships via meta
    const includeStr = meta?.include as string | undefined;
    if (includeStr) {
      params["include"] = includeStr;
    }

    const qs = buildQueryString(params);
    const url = `${API_URL}/${resource}${qs ? `?${qs}` : ""}`;
    const { data: response } = await axiosInstance.get<JsonApiResponse>(url);

    const deserialized = deserializeResponse(response);

    return {
      data: deserialized as any,
      total: (response.meta?.total as number) ?? deserialized.length ?? 0,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const params: Record<string, unknown> = {};
    const includeStr = meta?.include as string | undefined;
    if (includeStr) {
      params["include"] = includeStr;
    }

    const qs = buildQueryString(params);
    const url = `${API_URL}/${resource}/${id}${qs ? `?${qs}` : ""}`;
    const { data: response } = await axiosInstance.get<JsonApiResponse>(url);

    return {
      data: deserializeResponse(response) as any,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const params: Record<string, unknown> = {};
    const includeStr = meta?.include as string | undefined;
    if (includeStr) {
      params["include"] = includeStr;
    }

    const qs = buildQueryString(params);
    const url = `${API_URL}/${resource}${qs ? `?${qs}` : ""}`;
    const { data: response } = await axiosInstance.post<JsonApiResponse>(
      url,
      variables,
    );

    return {
      data: deserializeResponse(response) as any,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const params: Record<string, unknown> = {};
    const includeStr = meta?.include as string | undefined;
    if (includeStr) {
      params["include"] = includeStr;
    }

    const qs = buildQueryString(params);
    const url = `${API_URL}/${resource}/${id}${qs ? `?${qs}` : ""}`;
    const { data: response } = await axiosInstance.put<JsonApiResponse>(
      url,
      variables,
    );

    return {
      data: deserializeResponse(response) as any,
    };
  },

  // API returns 204 No Content on successful delete
  deleteOne: async ({ resource, id }) => {
    const url = `${API_URL}/${resource}/${id}`;
    await axiosInstance.delete(url);

    return {
      data: { id } as any,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const params: Record<string, unknown> = {
      "filter[id]": ids.join(","),
    };
    const includeStr = meta?.include as string | undefined;
    if (includeStr) {
      params["include"] = includeStr;
    }

    const qs = buildQueryString(params);
    const url = `${API_URL}/${resource}?${qs}`;
    const { data: response } = await axiosInstance.get<JsonApiResponse>(url);

    return {
      data: deserializeResponse(response) as any,
    };
  },

  custom: async ({ url, method, payload, query, headers }) => {
    const requestUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

    const { data } = await axiosInstance.request({
      url: requestUrl,
      method,
      data: payload,
      params: query,
      headers,
    });

    // Auto-deserialize if it looks like JSON:API
    const rawData = data as Record<string, unknown> | undefined;
    if (rawData?.data) {
      const innerData = rawData.data as Record<string, unknown>;
      if (innerData?.id && innerData?.attributes) {
        return {
          data: deserializeResponse(
            rawData as unknown as JsonApiResponse,
          ) as any,
        };
      }
      if (Array.isArray(innerData) && innerData[0]?.attributes) {
        return {
          data: deserializeResponse(
            rawData as unknown as JsonApiResponse,
          ) as any,
        };
      }
    }

    return {
      data: data as any,
    };
  },
};

export { axiosInstance };

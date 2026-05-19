/**
 * Generic API response wrapper.
 * All success responses use this shape so that payload is always under `data: T`.
 */
export interface ApiResponse<T> {
  data: T;
}

/**
 * Pagination metadata included in paginated list responses.
 */
export interface PageInfo {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
  totalPages: number;
}

export type LinkRel = 'self' | 'first' | 'prev' | 'next' | 'last';

/** Pagination links; all keys optional (prev/next/last only when applicable). */
export type Links = Partial<Record<LinkRel, { href: string }>>;

/**
 * Paginated API response: list in `data` plus pagination fields.
 * Use for list endpoints that support limit/offset (or page/pageSize).
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  pageInfo: PageInfo;
  _links?: Links;
}

/**
 * Cursor-paginated API response: list in `data`, optional nextCursor, and hasMore.
 * Use for list endpoints that support cursor-based pagination.
 */
export interface CursorPaginatedApiResponse<T> extends ApiResponse<T[]> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
  limit: number;
  pageInfo: PageInfo;
  _links?: Links;
}

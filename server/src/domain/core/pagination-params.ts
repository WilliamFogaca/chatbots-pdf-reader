export type PaginationParams = {
  page: number;
  itemsPerPage: number;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

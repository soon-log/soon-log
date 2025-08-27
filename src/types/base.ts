export type Pagination<T> = {
  results: Array<T>;
  page: number;
  nextPage: number | null;
  prevPage: number | null;
  perPage: number;
  total: number;
};

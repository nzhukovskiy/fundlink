import {Startup} from "../models/startup";

export interface PaginationResult<T> {
  data: T[],
  meta: {
    itemsPerPage: number,
    totalItems: number,
    currentPage: number,
    totalPages: number,
  },
  links: {
    current: "http://localhost:3000/startups?page=1&limit=20&sortBy=id:ASC"
  }
}

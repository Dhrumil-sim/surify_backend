import { PaginationQuery } from '@playlistModule';

export const getPaginationOptions = (query: PaginationQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = {
    [query.sortBy || 'createdAt']: query.sortOrder === 'asc' ? 1 : -1,
  };

  return { skip, limit, sort };
};

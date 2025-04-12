import { Query } from 'mongoose';

export const paginateQuery = <T>(
  query: Query<T[], T>,
  { page = 1, limit = 10 }: { page?: number; limit?: number }
): Query<T[], T> => {
  const skip = (Number(page) - 1) * Number(limit);
  return query.skip(skip).limit(Number(limit));
};

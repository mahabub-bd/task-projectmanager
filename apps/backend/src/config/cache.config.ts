export const cacheConfig = {
  ttl: 300, // 5 minutes default TTL
  max: 100, // Maximum number of items in cache
  isCacheable: (value: unknown) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'object') {
      // Don't cache error responses
      if ('statusCode' in value && (value as any).statusCode >= 400) {
        return false;
      }
    }
    return true;
  },
};

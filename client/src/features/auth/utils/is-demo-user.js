// @ts-check

/**
 * @param {User | null | undefined} user
 * @returns {boolean}
 */
export const isDemoUser = (user) => user?.userRole === 'DEMO';

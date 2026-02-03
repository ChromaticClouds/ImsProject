import { RANK_LABEL, ROLE_LABEL } from '@/constants';
import { getRoleDescription } from '../utils/index.js';

/**
 * @param {User} user
 */
export const toUserRowModel = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  rankLabel: RANK_LABEL[user.userRank],
  roleLabel: ROLE_LABEL[user.userRole],
  roleDescription: getRoleDescription(user.userRole, user.userRank),
  status: user.status,
  role: user.userRole,
  rank: user.userRank,
});

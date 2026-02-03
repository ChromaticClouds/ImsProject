import { ALL_ROLE_DESCRIPTION_BY_RANK, ROLE_DESCRIPTION } from "../constants/index.js";

/**
 * @param {'NONE'|'INBOUND'|'OUTBOUND'|'RECIEVE_ORDER'|'PLACE_ORDER'|'ALL'} role
 * @param {'FIRST_ADMIN'|'SECOND_ADMIN'|'EMPLOYEE'} rank
 */
export function getRoleDescription(role, rank) {
  return role === 'ALL'
    ? ALL_ROLE_DESCRIPTION_BY_RANK[rank]
    : ROLE_DESCRIPTION[role];
}

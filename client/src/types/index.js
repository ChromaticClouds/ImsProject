/**
 * @template [T=unknown]
 * @typedef {object} ApiResponse
 * @property {boolean} success
 * @property {T} [data]
 * @property {string} message
 */

/**
 * @typedef {object} LoginFormSchema
 * @property {string} eid
 * @property {string} password
 */

/**
 * @typedef {object} RegisterFormSchema
 * @property {string} name
 * @property {string} password
 */

/**
 * @typedef {object} AuthResponse
 * @property {string} eid
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */
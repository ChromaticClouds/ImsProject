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
 * @property {string} token
 * @property {string} name
 * @property {string} password
 * @property {string} confirmPassword
 */

/**
 * @typedef {object} AuthResponse
 * @property {string} eid
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */

/**
 * @typedef {object} User
 * @property {string} eid
 * @property {string} email
 * @property {string} name
 * @property {'FIRST_ADMIN' | 'SECOND_ADMIN' | 'EMPLOYEE'} rank
 * @property {'NONE' | 'INBOUND' | 'PLACE_ORDER' | 'OUTBOUND' | 'RECIEVE_ORDER' | 'ALL'} role
 */

/**
 * @typedef {'Supplier' | 'Seller'} VendorType
 */

/** 거래처 목록 타입
 * @typedef {object} Vendor
 * @property {number} id
 * @property {VendorType} type
 * @property {string=} vendorName
 * @property {string=} telephone
 * @property {string=} email
 * @property {string=} address
 */

/**
 * @typedef {object} PageInfo
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} VendorSearch
 * @property {number} page
 * @property {string=} type
 * @property {string=} keyword
 */

/**
 * Spring Pageable 형태 응답 가정
 * @typedef {Object} VendorListResponse
 * @property {Vendor[]=} list
 * @property {PageInfo} pageInfo
 */
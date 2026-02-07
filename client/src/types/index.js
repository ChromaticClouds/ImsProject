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
 * @property {number} id
 * @property {string} eid
 * @property {string} email
 * @property {string} name
 * @property {'FIRST_ADMIN' | 'SECOND_ADMIN' | 'EMPLOYEE'} userRank
 * @property {'NONE' | 'INBOUND' | 'PLACE_ORDER' | 'OUTBOUND' | 'RECEIVE_ORDER' | 'ALL'} userRole
 * @property {'PENDING' | 'ACTIVE' | 'DEACTIVE' | 'DELETED'} status
 */

/**
 * @typedef {object} RefreshResponse
 * @property {User} user
 * @property {string} token
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
 * @template T
 * @typedef {object} PageResponse
 * @property {T[]} content
 * @property {number} page        // 현재 페이지 (0부터)
 * @property {number} totalPages   // 전체 페이지 수
 * @property {number} totalElements // 전체 개수
 * @property {boolean} isFirst
 * @property {boolean} isLast
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

/**
 * @typedef {object} SearchCondition
 * @property {string[]} brand
 * @property {string[]} type
 * @property {number} page
 * @property {string} search
 */

/**
 * @typedef {object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} type
 * @property {string} brand
 * @property {string} productCode
 * @property {number} perCount
 * @property {number} salePrice
 * @property {number} volumn
 * @property {string | null} imageUrl
 */

/**
 * @param {object} SearchCondition
 * @param {string} page
 * @param {string} search
 * @param {string} type
 * @param {string} brand 
 */

/**
 * @typedef {object} ProductSuggest
 * @property {number} id
 * @property {number} productId
 * @property {string} name
 * @property {string} brand
 * @property {string} type
 * @property {number} count
 * @property {number} purchasePrice
 * @property {number} salePrice
 * @property {string} imageUrl
 */

/**
 * 재고 조정 시 목록에 이용되는 스키마
 * @typedef {object} AdjustItem
 * @property {number} id
 * @property {string} name
 * @property {string} brand
 * @property {string} type
 * @property {number} currentStock
 * @property {number} purchasePrice
 * @property {number} salePrice
 * @property {string} imageUrl
 * @property {number} adjustCount
 */

/**
 * @typedef {'SOJU' | 'WHISKEY' | 'LIQUOR' | 'TRADITIONAL' | 'KAOLIANG_LIQUOR'} BrandCategory
 */

/**
 * @typedef {object} CategoriesType
 * @property {string[]} types
 * @property {BrandCategory[]} brands
 */

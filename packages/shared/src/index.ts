/**
 * 判断对象
 */
export const isObject = (value) => {
    return typeof value === 'object' && value !== null
}

/** 判断函数 */
export const isFunction = (value) => {
    return typeof value === 'function'
}

/** 判断字符串 */
export const isString = (value) => {
    return typeof value === 'string'
}

/** 判断数字 */
export const isNumber = (value) => {
    return typeof value === 'number'
}

/** 判断数组 */
export const isArray = (value) => {
    return Array.isArray(value)
}

export const objectToString = (value: unknown) => Object.prototype.toString

/** 将传入的value 转换为字符串类型 */
export const toTypeSting = (value: unknown): string => objectToString.call(value) 

export const toRawType = (value: any): string => {
    return toTypeSting(value).slice(8, -1)
}
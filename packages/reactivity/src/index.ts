import { isObject, toRawType } from '@my-vue/shared'
import { mutableCollectionHandlers, mutableHandlers } from './handlers'
import { ReactiveFlags, Target, TargetType } from './index.type'


export const reactiveMap = new WeakMap<Target, any>()

function getTargetMap(type: string) {
    switch (type) {
        case 'Object':
        case 'Array':
            return TargetType.COMMON
        case 'Map':
        case 'WeakMap':
        case 'Set':
        case 'WeakSet':
            return TargetType.COLLECTION
        default:
            return TargetType.INVALID
    }
}


function getTargetType(value: Target) {
    return value[ReactiveFlags.SKIP] || !Object.isExtensible(value) ? TargetType.INVALID : getTargetMap(toRawType(value))
}

/**
 * 根据目标对象生成代理对象
 * @param target 目标对象
 * @param isReadonly 是否设置为只读对像
 * @param mutableHandlers 普通对象和数组 proxy handler 函数
 * @param mutableCollectionHandlers 集合类型 proxy handler 函数
 * @param proxyMap 以原始目标对象为key，以代理对象为值的weakMap
 */
function createReactiveObj(target: Target, isReadonly: boolean, mutableHandlers: ProxyHandler<any>, mutableCollectionHandlers: ProxyHandler<any>, proxyMap: WeakMap<Target, any>) {
    if(!isObject(target)) {
        // 原始值类型数据不能使用proxy代理
        console.warn('value cannot be mage reactive')
        return target
    }

    // 如果target对象是一个响应式对象直接返回
    if(target[ReactiveFlags.RAW] && (!isReadonly &&  target[ReactiveFlags.IS_REACTIVE])) {
        return target
    }

    // 如果原始对象已经存在响应式对象就直接返回获取到的响应式对象
    const existProxy = proxyMap.get(target)
    if(existProxy) {
        return existProxy
    }

    const targetType = getTargetType(target)

    if(targetType === TargetType.INVALID) {
        return target
    }

    // 创建代理对象
    const proxy = new Proxy(target, targetType === TargetType.COLLECTION ? mutableCollectionHandlers : mutableHandlers)

    proxyMap.set(target, proxy)

    return proxy
}

export function reactive(target) {
    if(target && (target as Target)[ReactiveFlags.IS_READONLY]) {
        // 只读对象不进行代理
        return target
    }
    return createReactiveObj(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap)
}


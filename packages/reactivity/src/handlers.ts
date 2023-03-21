import { hasOwn, isArray } from '@my-vue/shared';
import { CollectionTypes, ProxyHandler, Target, ReactiveFlags } from './index.type';

/**
 * 为了实现对数组 查询方法（index, indexOf,...）和栈方法(push, pop, shift, unshift)的拦截
 * 需要重写这些方法，
 * 实现的原理就是现在响应式对象中查找对应的方法，如果响应式对象中有就优先使用响应式对象中的方法，如果没有再去原对象中查找
 */
const arrayInstrumentations = createArrayInstrumentations();

function createArrayInstrumentations() {
    const instrumentations: Record<string, Function> = {};
    // 重写查找方法
    (['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {
        instrumentations[key] = function(this: unknown[], ...args: unknown[]) {
            const arr = toRaw(this) as any; // 获取原数组
            for(let i = 0; i < this.length; i++) {
                // 依赖收集
            }
    
            // 优先使用原始对象中 响应式的参数 args中是否有需要查找的结果（数组对象中的每项数据都是响应式数据）
            const res = arr[key](...args)
            if(res === -1 || res === false) {
                // 如果在原始对象中没有找到，返回 args 的原始类型
                return arr[key](...args.map(toRaw))
            } else {
                // 返回从响应式数据中找到的结果
                return res
            }
        }
    });
    
    // 重写栈方法
    (["push", "pop", "shift", "unshift", "splice"]).forEach(key => {
        instrumentations[key] = function(this:unknown, ...args: unknown[]) {
            // 1. 首先要屏蔽对lenght 属性的访问, 访问length属性时可能会隐式的导致length 像关联的副作用函数被执行，导致 栈溢出
            // pauseTracking()
            // 2. 调用原式数组上的 栈方法
            const res = (toRaw(this) as any)[key].apply(this, args)
            // resetTracking()
            return res
        }
    });

    return instrumentations
}

/**
 * 普通对象和数组 proxy handler
 */
export const mutableHandlers: ProxyHandler<object> = {
    get: (target: Target, key: string | symbol, reciver: object) => { 
        // 数组
        const targetIsArray = isArray(target)
        if(targetIsArray && hasOwn(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, reciver)
        }

        const res = Reflect.get(target, key, reciver)
        
    
        return target
    }
}

/** 
 * 根据代理对象返回原始对象
 */
export const toRaw = <T>(observer: T):T => {
    const raw  = observer && (observer as Target)[ReactiveFlags.RAW]
    return raw ? toRaw(raw) : observer
}

export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {}
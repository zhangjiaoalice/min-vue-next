export const enum TargetType {
    INVALID = 0, // 基本数据类型不能使用proxy代理
    COMMON = 1, // 普通对象和数组
    COLLECTION = 2, // 集合类型
}

export enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE='__v_isReactive', // 标记是否是响应式对象
    IS_READONLY='__v_isReadonly', // 表示是否是只读对象
    RAW = '__v-row', // 标记是否是原始对象
}

export interface Target {
    [ReactiveFlags.SKIP]?: Boolean;
    [ReactiveFlags.IS_REACTIVE]?: Boolean;
    [ReactiveFlags.IS_READONLY]?: Boolean;
    [ReactiveFlags.RAW]?: any
}

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
type MapTypes = Map<any, any> | WeakMap<any, any>
type SetTypes = Set<any> | WeakSet<any>
export type CollectionTypes = IterableCollections | WeakCollections

/**
 * 类数组数据类型
 */
export interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
}

// proxy handler type
export interface ProxyHandler<T extends object> {
    /**
     * 函数拦截方法
     */
    apply?(target: T, thisArg: any, argArray: any[]): any;

    /** 
     * new 操作 拦截函数
     */
    construct?(target: T, argArray: any[], newTarget: Function): object;

    /**
     * `Object.defineProperty()` 对象属性描述符定义函数拦截函数
     */
    defineProperty?(target: T, property: string | symbol, attributes: PropertyDescriptor): boolean;

    /**
     * `delete` 删除属性方法拦截函数
     */
    deleteProperty?(target: T, property: string | symbol): boolean;

    /**
     *  `get` 拦截函数
     */
    get?(target: T, reciver: any): any;

    /**
     * `set` 拦截函数
     */
    set?(target: T, P: string | symbol, newVal: any, reciver: any): boolean;

    /**
     * `Object.getOwnPropertyDescriptor()` 拦截函数
     */
    getOwnPropertyDescriptor?(target: T, p: string | symbol): PropertyDescriptor | undefined;

    /**
     * `[[getPrototypeOf]]` 内存槽 方法拦截函数
     */
    getPrototypeOf?(target: T): object | null;

    /**
     * in 操作符拦截函数
     */
    has?(target: T, p: string | symbol): boolean;

    /**
     * `Object.isExtennsible()` 方法拦截函数
     */
    isExtensible?(target: T): boolean;

    /**
     * `Object.preventExtensions()` 方法的拦截函数
     */
    preventExtensions?(target: T): boolean;

    /**
     * `for..in` 操作 拦截函数
     */
    ownKeys?(target: T): ArrayLike<string| symbol>;

    /**
     * `Object.setPrototypeOf` 拦截函数
     */
    setPrototypeOf?(target: T, v: object | null):boolean;
}

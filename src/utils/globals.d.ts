/// doc: https://www.typescriptlang.org/docs/handbook/utility-types.html
/// 基于@root-project-dir/node_modules/typescript/lib/lib.d.ts的扩展

/// NOTE: 在类型的条件判断中，never被认为是空的联合类型，添加 [] 是为了防止条件判断中的分配与自动推断，否则将直接返回被分配的类型：never
export {};
declare global { // 声明进入全局命名空间的类型，或者增加全局命名空间中的现有声明
     /**
     * 获取对象中的 key
     * example: ObjectPropertyKey<{ a: string, b: number }> => 'a' | 'b
     */

     type ObjectPropertyKey<T> = keyof T

     /**
     * 获取对象中某一项的 value
     * example: ObjectPropertyValue<{ a: string, b: number }> => string | number
     * example: ObjectPropertyValue<{ a: string, b: number }, 'a'> => string
     */

     type ObjectPropertyValue<T, U extends ObjectPropertyKey<T> = ObjectPropertyKey<T>> = T[U]

    /**
     * 获取或提取Promise<T>中的T类型
     * example: PromiseInnerType<Promise<string>> => string
     */
    type PromiseInnerType<T extends Promise<any>> = [T] extends [Promise<infer P>] ? P : never;

    /**
     * 获取或提取Array<T>中的T类型
     * example: ArrayInnerType<string> => string
     */
    type ArrayInnerType<T = Array<any>> = [T] extends [Array<infer P>] ? P : never;

    /**
     * ReturnType的Promise版本
     * example: PromiseReturnType<(...rest: any[]) => Promise<string>> -> string
     */
    type PromiseReturnType<T extends (...rest: any[]) => any> = [ReturnType<T>] extends [Promise<infer R>] ? R : ReturnType<T>;

    /**
     * 将异步函数返回的单个对象转换为数组的子项
     * example: PromiseReturnArrayOuter<(...rest: any[]) => Promise<{a: string}>> => {a: string}[]
     * example: PromiseReturnArrayOuter<(...rest: any[]) => Promise<{a: string}, 'a'>> => string[]
     */
    type PromiseReturnArrayOuter<T extends (...rest: any[]) => any, U extends ObjectPropertyKey<PromiseReturnType<T>> = never> = Array<[U] extends [never] ? PromiseReturnType<T> : ObjectPropertyValue<PromiseReturnType<T>, U>>

    /**
     * 将异步函数返回的数组的子项转换为单个对象
     * example: PromiseReturnArrayInner<(...rest: any[])=> Promise<string[]>> -> string
     * example: PromiseReturnArrayInner<(...rest: any[])=> Promise<{a: string[]}>, 'a'> -> string
     */
    type PromiseReturnArrayInner<T extends (...rest: any[]) => any, U extends ObjectPropertyKey<[PromiseReturnType<T>] extends [Array<any>] ? ArrayInnerType<PromiseReturnType<T>> : PromiseReturnType<T>> = never> = [U] extends [never] ? ArrayInnerType<PromiseReturnType<T>> : ArrayInnerType<[ObjectPropertyValue<[PromiseReturnType<T>] extends [Array<any>] ? ArrayInnerType<PromiseReturnType<T>> : PromiseReturnType<T>, U>]>

    /**
     * 将联合类型转成交叉类型
     * example: UnionToIntersection<{ a: string } | { b: number }> => { a: string } & { b: number }
     */
    type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

    /**
     * 将交叉类型拍平
     * example: Prettify<{ a: string } & { b: number } & { c: boolean }> => { a: string; b: number; c: boolean }
     */
    type Prettify<T> = [T] extends [infer U] ? { [K in ObjectPropertyKey<U>]: ObjectPropertyValue<U, K> } : never

    /**
     * 将将联合类型交叉并拍平
     * example: PrettifyUnion<{ a: string } | { b: number } | { c: boolean }> => { a: string; b: number; c: boolean }
     */
    type PrettifyUnion<T> = Prettify<UnionToIntersection<T>>

    /**
     * 将数组转换为对象（数组子项的特定 value 转换为对象的 key 和 value）
     * example: ArrayInnerPair<{ a: string, b: number }[]> => { [key in string | number]: string | number }
     * example: ArrayInnerPair<{ a: string, b: number }[], 'a', 'b'> => { [a in string]: number }
     */
    type ArrayInnerPair<T extends Array<any>, U extends ObjectPropertyKey<T[number]> = ObjectPropertyKey<T[number]>, P extends ObjectPropertyKey<T[number]> = ObjectPropertyKey<T[number]>> = Record<[ObjectPropertyValue<T[number], U>] extends [PropertyKey] ? ObjectPropertyValue<T[number], U> : never, ObjectPropertyValue<T[number], P>> 

    /**
     * 提取函数的参数类型，Parameters 的单个参数版本
     * example: Parameter<(a: string) => any> => string
     * example: Parameter<(a: string, b: number) => any> -> string | number
     */
    type Parameter<T extends (arg: any) => any> = ArrayInnerType<Parameters<T>> // Parameters<T>[number];

    /**
     * 让泛型不被自动推导，成为必填项
     * example: NoInfer<P = void> & (P extends void ? 'You have to pass in a generic' : {}) => err: You have to pass in a generic
     */
    type NoInfer<T> = [T][T extends any ? 0 : never]

    /**
     * TODO: 提取泛型中的模板
     * example: ExcludeOuter<Array<T>> => T
     * example: ExcludeOuter<Promise<T>> => T
     */
    // type ExcludeOuter<T> = T extends Array<infer X> ? X : never
}
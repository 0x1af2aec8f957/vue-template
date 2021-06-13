/// doc: https://www.typescriptlang.org/docs/handbook/utility-types.html
/// 基于@root-project-dir/node_modules/typescript/lib/lib.d.ts的扩展

/// CUSTOM ECMAScript APIs
/**
 * 获取或提取Promise<T>中的T类型
 * example: PromiseInnerType<Promise<string>> -> string
 */
export declare type PromiseInnerType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

/**
 * ReturnType的Promise版本
 * example: PromiseReturnType<typeof ()=> Promise<string>> -> string
 */
export declare type PromiseReturnType<T extends (...rest: any[]) => any> = ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>;
// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

/**
 * 将联合类型转成交叉类型
 * example: { a: string } | { b: number } => { a: string } & { b: number }
 */
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * 将交叉类型拍平
 * example: Prettify<{ a: string } & { b: number } & { c: boolean }> -> { a: string; b: number; c: boolean }
 */
export declare type Prettify<T> = [T] extends [infer U] ? { [K in keyof U]: U[K] } : never

/**
 * 让泛型不被自动推导，成为必填项
 * example: NoInfer<P = void> & (P extends void ? 'You have to pass in a generic' : {}) -> err: You have to pass in a generic
 */
export declare type NoInfer<T> = [T][T extends any ? 0 : never]

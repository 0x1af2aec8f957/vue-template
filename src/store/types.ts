export interface State{ // RootState
    a: number;
}

export interface Payload{ // NOTE: 可以进一步约束payload参数
    [key: string]: any;
}

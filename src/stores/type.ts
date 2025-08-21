export interface response<T = any> {
    code: number;
    message: string;
    data: T | null;
}

export interface pageInfoReq {
    page: number;
    size: number;
}

export interface pageInfoRes {
    total: number;
}

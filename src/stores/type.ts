export interface response<dataType = any> {
    code: number;
    message: string;
    data: dataType;
}

export interface pageInfoReq {
    page: number;
    size: number;
}

export interface pageInfoRes {
    total: number;
}

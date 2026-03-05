export enum JudgeType {
    Unknown = 0,
    ACM = 1,
    OI = 2,
}

export interface JudgeTypeOption {
    label: string;
    value: JudgeType;
}

export const JUDGE_TYPE_LABEL_MAP: Record<JudgeType, string> = {
    [JudgeType.Unknown]: '未知',
    [JudgeType.ACM]: 'ACM',
    [JudgeType.OI]: 'OI',
}

export const JUDGE_TYPE_OPTIONS: JudgeTypeOption[] = [
    {label: JUDGE_TYPE_LABEL_MAP[JudgeType.ACM], value: JudgeType.ACM},
    {label: JUDGE_TYPE_LABEL_MAP[JudgeType.OI], value: JudgeType.OI},
]

export const getJudgeTypeLabel = (judgeType: number): string => {
    if (judgeType in JUDGE_TYPE_LABEL_MAP) {
        return JUDGE_TYPE_LABEL_MAP[judgeType as JudgeType]
    }
    return `待定义(${judgeType})`
}

export const getJudgeTypeValueByLabel = (label: string): JudgeType => {
    const option = JUDGE_TYPE_OPTIONS.find((item) => item.label === label)
    return option?.value ?? JudgeType.Unknown
}

export interface JudgeTypeOption {
    label: string;
    value: number;
}

export const JUDGE_TYPE_OPTIONS: JudgeTypeOption[] = [
    { label: '未知题型', value: 0 },
    { label: 'ACM编程题', value: 1 },
]

export const getJudgeTypeLabel = (judgeType: number): string => {
    const option = JUDGE_TYPE_OPTIONS.find((item) => item.value === judgeType)
    if (option) {
        return option.label
    }
    return `待定义(${judgeType})`
}

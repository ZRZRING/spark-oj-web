export enum JudgeResultStatus {
    Waiting = "Waiting",
    Running = "Running",
    Accepted = "Accepted",
    WrongAnswer = "Wrong Answer",
    TimeLimitExceeded = "Time Limit Exceeded",
    MemoryLimitExceeded = "Memory Limit Exceeded",
    RuntimeError = "Runtime Error",
    CompileError = "Compile Error",
}

export const JUDGE_RESULT_OPTIONS = [
    { label: "Waiting", value: JudgeResultStatus.Waiting },
    { label: "Running", value: JudgeResultStatus.Running },
    { label: "Accepted", value: JudgeResultStatus.Accepted },
    { label: "Wrong Answer", value: JudgeResultStatus.WrongAnswer },
    { label: "Time Limit Exceeded", value: JudgeResultStatus.TimeLimitExceeded },
    { label: "Memory Limit Exceeded", value: JudgeResultStatus.MemoryLimitExceeded },
    { label: "Runtime Error", value: JudgeResultStatus.RuntimeError },
    { label: "Compile Error", value: JudgeResultStatus.CompileError },
]

// 编程语言枚举
export enum Language {
    C = "c",
    CPP = "cpp",
    Java = "java",
    Python = "python",
}

export const LANGUAGE_OPTIONS = [
    { label: "C", value: Language.C },
    { label: "C++", value: Language.CPP },
    { label: "Java", value: Language.Java },
    { label: "Python", value: Language.Python },
]

// 判题类型枚举
export enum JudgeType {
    Standard = "Standard",
    SpecialJudge = "Special Judge",
    Interactive = "Interactive",
    Communication = "Communication",
    OutputOnly = "Output Only",
    Unknown = "Unknown",
}

export const JUDGE_TYPE_OPTIONS = [
    { label: "Standard", value: JudgeType.Standard },
    { label: "Special Judge", value: JudgeType.SpecialJudge },
    { label: "Interactive", value: JudgeType.Interactive },
    { label: "Communication", value: JudgeType.Communication },
    { label: "Output Only", value: JudgeType.OutputOnly },
    { label: "Unknown", value: JudgeType.Unknown },
]

// 排行榜题目状态枚举
export enum RankingProblemStatus {
    NotTried = "",           // 未尝试 (空字符串)
    Accepted = "Accepted",   // 已通过
    Reject = "Reject",       // 尝试但未通过
}

// 获取排行榜题目状态样式
export function getRankingStatusStyle(status: string): { bg: string; color: string } {
    switch (status) {
        case RankingProblemStatus.Accepted:
            return { bg: '#52c41a', color: '#fff' }
        case RankingProblemStatus.Reject:
            return { bg: '#ff4d4f', color: '#fff' }
        default:
            return { bg: '#f5f5f5', color: '#999' }
    }
}

export enum ContestVisibility {
    Public = "Public",
    Private = "Private",
}

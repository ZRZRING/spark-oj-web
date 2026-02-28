const toCamelCase = (key: string): string => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return Object.prototype.toString.call(value) === '[object Object]'
}

export const transformKeysToCamelCase = <T>(value: T): T => {
    if (Array.isArray(value)) {
        return value.map((item) => transformKeysToCamelCase(item)) as T
    }

    if (!isPlainObject(value)) {
        return value
    }

    const result: Record<string, unknown> = {}

    Object.entries(value).forEach(([key, raw]) => {
        const nextKey = toCamelCase(key)
        result[nextKey] = transformKeysToCamelCase(raw)
    })

    return result as T
}

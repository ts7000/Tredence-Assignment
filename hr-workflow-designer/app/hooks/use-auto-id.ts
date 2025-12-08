export const useAutoId = () => {
  const counter: Record<string, number> = {}

  const generateId = (prefix: string): string => {
    counter[prefix] = (counter[prefix] || 0) + 1
    return `${prefix}-${counter[prefix]}`
  }

  return generateId
}

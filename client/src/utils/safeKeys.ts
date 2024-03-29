export function objectKeys<T extends Record<string, unknown>>(obj: T) {
  return Object.keys(obj) as (keyof T)[]
}
export async function HandleError<T>(promise: Promise<T>): Promise<[null, T] | [Error, null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    return [err as Error, null];
  }
}
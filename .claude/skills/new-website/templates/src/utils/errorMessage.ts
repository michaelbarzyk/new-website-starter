/** Readable text for anything caught in a try/catch (Error, Firebase error, or other). */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

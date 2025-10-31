export function toCamelCasePath(path: string): string {
  return path
    .split(".")
    .map((segment) => segment.charAt(0).toLowerCase() + segment.slice(1))
    .join(".");
}

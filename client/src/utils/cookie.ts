export default function getDocumentCookie(value: string) {
  return document.cookie
  .split("; ")
  .find((row) => row.startsWith(value + "="))
  ?.split("=")[1];
}
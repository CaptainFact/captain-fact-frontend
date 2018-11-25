export default function parseServerError(responseBody) {
  if (responseBody.error) return responseBody.error
  if (responseBody.errors) return responseBody.errors
  return 'unknown'
}

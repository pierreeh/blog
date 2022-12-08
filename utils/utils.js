export function jsonify(params) {
  return JSON.parse(JSON.stringify(params))
}
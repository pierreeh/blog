export function jsonify(params) {
  return JSON.parse(JSON.stringify(params))
}

export const dateFormated = new Date(Date.now())
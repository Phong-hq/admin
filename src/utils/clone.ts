export const clone = (data: any) => {
  const json = JSON.stringify(data)
  return JSON.parse(json)
}

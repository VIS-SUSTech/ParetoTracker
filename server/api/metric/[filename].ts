export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  return useStorage('assets:server').getItem(`${filename}/metric.json`)
})

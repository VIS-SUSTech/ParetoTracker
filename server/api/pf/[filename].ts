import { emptyProps } from "naive-ui"

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  return useStorage('assets:server').getItem(`${filename}/pf.json`)
})
emptyProps
export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename');
  let data:any = []

  for (let i = 1; i <= 10; i++) {
    let temp:any = await useStorage('assets:server').getItem(`${filename}/chunk_${i}.json`);
    data = [...data,...temp]
  }

  return data
})

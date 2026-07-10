export const formatSlug = (slug: string): string => {
  let result = slug || ''
  result = result.toLocaleLowerCase()
  result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  result = result.replace(/đ/g, 'd').replace(/Đ/g, 'D')
  result = result.replace(/\s+/g, '')
  return result
}

export const formatSlugUrl = (str:string):string => { 
  let result = str || ''
	result = result.toLowerCase();     
	result = result
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
	result = result.replace(/[đĐ]/g, 'd');
	result = result.replace(/([^0-9a-z-\s])/g, '');
	result = result.replace(/(\s+)/g, '-');
	result = result.replace(/-+/g, '-');
	result = result.replace(/^-+|-+$/g, '');
 
	return result;
}

export const getRandomDigits = (length: number): string => {
  const num = Math.floor(Math.random() * 10 ** length)
  return num.toString().padStart(length, '0')
}

export function getRandomString(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

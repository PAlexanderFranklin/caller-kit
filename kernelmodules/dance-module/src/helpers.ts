export const jsonToArray = (json: any) => {
	let str = JSON.stringify(json, null, 0);
	let file = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		file[i] = str.charCodeAt(i);
	}
	return file;
};

export const arrayToJson = (arr: Uint8Array) => {
  const jsonString = Buffer.from(arr).toString('utf8');
  return JSON.parse(jsonString);
}
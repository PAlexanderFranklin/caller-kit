import { openIndependentFileSmall } from "libkmodule";

export const jsonToArray = (json: any) => {
	let str = JSON.stringify(json, null, 0);
	let file = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		file[i] = str.charCodeAt(i);
	}
	return file;
};

export const arrayToJson = (arr: Uint8Array) => {
  let jsonString = String.fromCharCode(...arr);
  try {
    return JSON.parse(jsonString);
  }
  catch (err) {
    throw [err, `json string: ${jsonString}`]
  }
}

export const openFile = async (seed:Uint8Array, inode:string) => {
  let [res, error] = await openIndependentFileSmall(seed, inode);
  if (error) {
    throw error;
  }
  return res;
}

export const readData = async (file: any) => {
  let [res, error] = await file.readData();
  if (error) {
    throw error;
  }
  return arrayToJson(res);
}
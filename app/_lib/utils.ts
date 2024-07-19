import { uploadData, getUrl } from "aws-amplify/storage";

async function uploadFileToPublicFolder(file: File): Promise<string> {
  const res = await uploadData({
    path: `public/${file.name}_${Date.now()}`,
    data: file,
  }).result;

  const { url } = await getUrl({
    path: res.path,
  });

  return `${url.origin}${url.pathname}`;
}

export { uploadFileToPublicFolder };

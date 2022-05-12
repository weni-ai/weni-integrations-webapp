import axios from 'axios';

async function dataUrlToFile(dataUrl, fileName, ignoreQuery = false) {
  if (!dataUrl) {
    return null;
  }

  if (!ignoreQuery && !dataUrl.startsWith('data:')) {
    dataUrl = dataUrl.concat('?file');
  }

  const res = await axios.get(dataUrl, { responseType: 'blob' });
  const blob = await res.data;
  return new File([blob], fileName, { type: res.headers['content-type'] });
}

async function toBase64(fileUrl) {
  if (!fileUrl) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileUrl);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export { dataUrlToFile, toBase64 };

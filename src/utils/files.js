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
    const blob = new Blob([fileUrl], { type: fileUrl.type });
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function getHeightAndWidthFromDataUrl(dataURL) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      });
    };
    img.src = dataURL;
  });
}

export { dataUrlToFile, toBase64, getHeightAndWidthFromDataUrl };

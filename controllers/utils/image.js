/* 이미지 Url 배열을 DB에 저장할 텍스트로 알맞게 변환 시킴. */
const convertBodyImageArrToText = (imgArr, baseUrl) => {
  const baseUrlSize = baseUrl.length;
  let imgText = '';

  /* 아무 이미지도 없는 경우 */
  if (imgArr.length === 0) {
    return imgText;
  }
  for (let i = 0; i < imgArr.length; i++) {
    if (i === 0) {
      imgText += `${imgArr[i].slice(baseUrlSize)}`;
    } else {
      imgText += `&&${imgArr[i].slice(baseUrlSize)}`;
    }
  }
  return imgText;
};
/* S3에 파일 업로드 후 받아온 req.files의 이미지를 문자열로 반환하는 함수 */
const convertImageArrToText = (imgArr, baseUrl) => {
  const baseUrlSize = baseUrl.length;
  let imgText = '';
  /* 아무 이미지도 없는 경우 */
  if (imgArr.length === 0) {
    return imgText;
  }
  for (let i = 0; i < imgArr.length; i++) {
    if (i === 0) {
      imgText += `${imgArr[i].transforms[0].location.slice(baseUrlSize)}`;
    } else {
      imgText += `&&${imgArr[i].transforms[0].location.slice(baseUrlSize)}`;
    }
  }
  return imgText;
};

/* DB에 저장 된 reviewImages를 배열로 변환 */
const convertImageTextToArr = (imgText, baseUrl) => {
  let imgArr = [];
  /* 아무 이미지도 없는 경우 */
  if (imgText.length === 0) {
    return imgArr;
  }

  imgArr = imgText.split('&&');
  for (let i = 0; i < imgArr.length; i++) {
    imgArr[i] = `${baseUrl}${imgArr[i]}`;
  }
  return imgArr;
};

/* DB에 들어있는 이미지들 중 대표 이미지만 String으로 반환하는 함수 */
const getMainImage = (imgText, baseUrl) => {
  /* DB에서 가져온 imgText가 비어있는 경우 */
  let target = '';
  if (imgText.length === 0) {
    return target;
  }
  target = `${baseUrl}${imgText.split('&&')[0]}`;
  return target;
};

module.exports = {
  convertImageArrToText,
  convertImageTextToArr,
  getMainImage,
  convertBodyImageArrToText,
};

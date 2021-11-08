/* 유저, 포스트, 리뷰 이미지 등록시 디비에 저장 할 때 변환 시켜 줌
 * 배열로 받은 이미지를 DB에 저장할 텍스트로 변환
 *  baseUrl은 process.env.POST_BASE_URL or  REVIEW_BASE_URL or USER_BASE_URL 이 배열로 들어온다.
 */

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


let url = "http://127.0.0.1:3000";

const btnreviewWrite = document.querySelector("#reviewWriteSubmit");

// 1. #signup 클릭
btnreviewWrite.addEventListener("click", signup);

async function signup(event) {
  const title = document.querySelector("#placeName").value;
  const category = document.querySelector("input[type=radio][name=category]:checked").value;
  const address = document.querySelector("#placeAddress").value;
  const star = document.querySelector("#star").value;
  const review = document.querySelector("#inputReviewBox").value;
  const pictureURL = document.querySelector("#picture").value;

  // 3. 회원가입 API 요청
  const signUpReturn = await axios({
    method: "post", // http method
    url: url + "/write",
    headers: {}, // packet header
    data: { title: title, category: category, address: address,  star: star, review:review, pictureURL: pictureURL }, // packet body
  });

  // 4. 요청이 성공적이지 않다면, alert message
  const isValidSignUp = signUpReturn.data.code == 200;

  if (!isValidSignUp) {
    return alert("요청에 문제가 생겼습니다.");
  }

  return location.replace("../front/matzip.html");
}
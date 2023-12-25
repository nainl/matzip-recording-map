

var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(37.54, 126.96), //지도의 중심좌표.
	level: 9 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

async function getDataSet(category){
	let qs = category;
	if (!qs) {
		qs="";
	}

	const dataSet = await axios({
		method: "get",
		url: `http://13.209.127.234:3000/restaurants?category=${qs}`,
		headers: {},
		dats: {}
		
	});
	return dataSet.data.result;
};

getDataSet();


// 주소 - 좌표 변환 함수 (비동기 문제 발생 해결) ****************
// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();
function getCoordsByAddress(address) {
  // promise 형태로 반환
  return new Promise((resolve, reject) => {
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        return resolve(coords);
      }
      reject(new Error("getCoordsByAddress Error: not valid Address"));
    });
  });
}

function getContent(data) {
	//별점 표시
	switch(data.star){
		case '5' :
			data.star = "⭐⭐⭐⭐⭐";
			break;
		case '4' :
			data.star = "⭐⭐⭐⭐";
			break;
		case '3' :
			data.star = "⭐⭐⭐";
			break;
		case '2' :
			data.star = "⭐⭐";
			break;
		case '1' :
			data.star = "⭐";
			break;
	}
	//인포윈도우 표시
	return  `
	
	<div class="infowindow">
    <div class="infowindow-img-container">
      <img src="${data.pictureURL}" class="infowindow-img"/>
    </div>
    <div class="infowindow-body">
      <h5 class="infowindow-title">${data.title}</h5>
	  <p class="star">${data.star}</p>
	  <p class="infowindow-category">${data.category}</p>

      <p class="infowindow-address">${data.address}</p>
	  <div class="infowindow-review">${data.review}</div>
      <a href="" class="infowindow-btn" target="_blank"></a>
    </div>
	
  </div>`;

}

//마커이미지
var imageSrc = '', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(30, 30), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

var imageSrcKorea ="./mapmarker/korea.png";
var imageSrcChina ="./mapmarker/china.png";
var imageSrcWestern ="./mapmarker/western.png";
var imageSrcJapan ="./mapmarker/japan.png";
var imageSrcWheat ="./mapmarker/wheat.png";
var imageSrcMeat ="./mapmarker/meat.png";
var imageSrcCafe ="./mapmarker/cafe.png";
var imageSrcEtc ="./mapmarker/etc.png";





// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    markerPosition = new kakao.maps.LatLng(37.54699, 127.09598); // 마커가 표시될 위치입니다



async function setMap(dataSet) {
  for (var i = 0; i < dataSet.length; i++) {
    let position = await getCoordsByAddress(dataSet[i].address);
    console.log(position);


	let imgSrc = ''
	if (dataSet[i].category === "한식") {
		imgSrc = imageSrcKorea
	} else if (dataSet[i].category === "중식"){
		imgSrc = imageSrcChina
	} else if (dataSet[i].category === "양식"){
		imgSrc = imageSrcWestern
	} else if (dataSet[i].category === "일식"){
		imgSrc = imageSrcJapan
	} else if (dataSet[i].category === "분식"){
		imgSrc = imageSrcWheat
	} else if (dataSet[i].category === "고기/구이"){
		imgSrc = imageSrcMeat
	} else if (dataSet[i].category === "카페/디저트"){
		imgSrc = imageSrcCafe
	} else if (dataSet[i].category === "기타"){
		imgSrc = imageSrcEtc
	}

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      // position: positions[i].latlng, // 마커를 표시할 위치
      position: position,
      // title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
	  image: new kakao.maps.MarkerImage(imgSrc, imageSize)
    });

	markerArray.push(marker);

	// 마커에 표시할 인포윈도우를 생성합니다 
    var infowindow = new kakao.maps.InfoWindow({
        content: getContent(dataSet[i]), // 인포윈도우에 표시할 내용
    });

	infowindowArray.push(infowindow);

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다 
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow, position));
    kakao.maps.event.addListener(map, 'click', makeOutListener(infowindow));
  }
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow, position) {
    return function() {
		// 클릭시 다른 인포윈도우 닫기
		closeInfoWindow();
        infowindow.open(map, marker);
		map.panTo(position);
    };
}


let infowindowArray = [];
function closeInfoWindow() {
	for(let infowindow of infowindowArray) {
		infowindow.close(); 
	}
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
}

const categoryMap = {
  korea: "한식",
  china: "중식",
  japan: "일식",
  western: "양식",
  wheat: "분식",
  meat: "고기/구이",
  etc: "기타",
  cafe: "카페/디저트",
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

async function categoryHandler(event) {
	const categoryId = event.target.id;
	const category = categoryMap[categoryId];

	try {
		//데이터분류
		let categorizeDataSet = await getDataSet(category);

		// 기존마커삭제
		closeMarker();

		// 기존 인포윈도우 닫기
		closeInfoWindow();

		setMap(categorizeDataSet);
	} catch (error) {
		console.error(error);
	}

	
}

let markerArray = [];
function closeMarker() {
	for (marker of markerArray) {
		marker.setMap(null); 
	}
	
}

async function setting(){
	try {
		const dataSet = await getDataSet();
		setMap(dataSet);
	} catch (error) {
		console.error(error);
	}	
}

setting();




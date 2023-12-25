$(document).ready(function(){
    
    var placeName = $("#placeName");
    var placeAddress = $("#placeAddress");
    var star = $("#star");
    var inputReviewbox = $("#inputReviewBox");
    var reviewWriteSubmit = $("#reviewWriteSubmit");
    
    var valueError = $("#valueError");

    reviewWriteSubmit.click(function(){
        if(placeName.val() == ''){
            valueError.text('장소 이름을 입력하세요');
            placeName.focus();
            timeOutCall();
            return false;
        }

        if(placeAddress.val() == ''){
            valueError.text('주소를 입력하세요');
            placeAddress.focus();
            timeOutCall();
            return false;
        }

        if(star.val() == ''){
            valueError.text('별점을 선택하세요');
            star.focus();
            timeOutCall();
            return false;
        }

        if(inputReviewbox.val() == ''){
            valueError.text('후기를 입력해주세요');
            inputReviewbox.focus();
            timeOutCall();
            return false;
        }

        return true;
    })
});

function timeOutCall(){
    setTimeout(function(){
        $('#valueError').text('');
    },2000);
}
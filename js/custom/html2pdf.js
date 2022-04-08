var rendering_img = new Array; // 이미지 배열
var content_width = 200, padding = 5; // A4 사이즈

// PDF 다운
function downloadPDF(){
    var div_list = document.querySelectorAll(".pdf_pages");
    var deferreds = [];
    var doc = new jsPDF("p", "mm", "a4");

    for(var i = 0; i < div_list.length; i++){ // div 개수만큼 이미지 생성
        var deferred = $.Deferred();
        deferreds.push(deferred.promise());
        generateCanvas(i, doc, deferred, div_list[i]);
    }

    $.when.apply($, deferreds).then(function (){
        var sorted = rendering_img.sort(function(a,b){return a.num < b.num ? -1 : 1;}); // 정렬
        var cur_height = padding;

        for(var i = 0; i < sorted.length; i++){
            if(cur_height + sorted[i].height > 297 - padding * 2){
                // A4사이즈에서 남은 공간 < 이미지 높이면 페이지 다음 장 추가
                doc.addPage();
                cur_height = padding;
                doc.addImage(sorted[i].image, 'jpeg', padding, cur_height, content_width, sorted[i].height);
                cur_height += sorted[i].height;
            }else{
                doc.addImage(sorted[i].image, 'jpeg', padding, cur_height, content_width, sorted[i].height);
                cur_height += sorted[i].height;
            }
        }
        //doc.textWithLink('test', 50, 100, { url: 'http://github.com/nrmhvr'});
        doc.save('Resume_KYW.pdf');
    
        // init
        cur_height = padding;
        rendering_img = new Array;
    })
}

// div to image
function generateCanvas(i, doc, deferred, curList){
    var pdfWidth = $(curList).outerWidth() * 0.2645 // px -> mm
    var pdfHeight = $(curList).outerHeight() * 0.2645
    var HeightCalc = content_width * pdfHeight / pdfWidth; // 높이 조절

    html2canvas(curList).then(
        function(canvas){
            var img = canvas.toDataURL('image/jpeg', 1.0); // 이미지 형식
            rendering_img.push({num:i, image:img, height:HeightCalc}); // rendering_img 배열에 이미지 저장
            deferred.resolve();
        }
    );
}
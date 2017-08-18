$(function(){
  $(".commentSubmit").click(function(){
    var pName = $(".commentName");
    var pText = $(".commentText");

    if($.trim(pName.val())==""){
      alert("작성자를 입력하세요.");
      pName.focus();
      return ;
    }
    else if($.trim(pText.val())==""){
      alert("내용을 입력하세요.");
      pText.focus();
      return ;
    }
    var commentParentText = '<tr style="border:1px solid black"> <td class = "commentCol"> <strong>작성자 :</strong>'+pName.val()+'</td><td class = "commentVal">'+pText.val().replace(/\n/g, "<br>")+
                            '</td><tr><td colspan="2"class = "commentReg"><button>답글 등록하기</button></td><tr></tr>';
    if($("#commentTable").contents().length == 0){
      $('#commentTable').append(commentParentText);
    }
    else{
        $("#commentTable tr:last").after(commentParentText);
    }
    $(".commentName").val("");
    $(".commentText").val("");
  });
  $(document).on("click","#commentTable button",function(){
      var str = prompt("답글 내용을 입력하세요. ");
      var languageCheck = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/;
      var languageCheck2 = /^(www\.)/;
      var parentElement = $(this).parent().parent();
      var addingText;
      if(str == null){
        return ;
      }
      else if(languageCheck.test(str)){
        var url= str;
        var urlEncoded = encodeURIComponent(url);
        var apiKey = "5911811bb03733aa24d73776";
        var requestUrl = 'http://opengraph.io/api/1.0/site/' + urlEncoded ;
        if(apiKey){
          requestUrl = 'https://opengraph.io/api/1.0/site/' + urlEncoded + '?app_id=' + apiKey;
        }
          $.getJSON(requestUrl, function( json ) {
            // Throw the object in the console to see what it looks like!
            console.log('json', json);
            // Update the HTML elements!
            addingText = '<tr><td><div><div class="openGraph"><a target ="new" href="'+url+'"><img class="openGraphIcon" src="'+json.hybridGraph.image+'"/></a></div></td><td class="openGraphContent"><div><h2 id="title">'+json.hybridGraph.title+'</h2><span id="description">'+json.hybridGraph.description+'</span></div></div></td></tr>'
            parentElement.after(addingText);
        });
      }
      else if(languageCheck2.test(str)){
        var url= "https://"+str;
        var urlEncoded = encodeURIComponent(url);
        var apiKey = "5911811bb03733aa24d73776";
        var requestUrl = 'http://opengraph.io/api/1.0/site/' + urlEncoded ;
        if(apiKey){
          requestUrl = 'https://opengraph.io/api/1.0/site/' + urlEncoded + '?app_id=' + apiKey;
        }
          $.getJSON(requestUrl, function( json ) {
            // Throw the object in the console to see what it looks like!
            console.log('json', json);
            // Update the HTML elements!
            addingText = '<tr><td><div><div class="openGraph"><a target ="new" href="'+url+'"><img class="openGraphIcon" src="'+json.hybridGraph.image+'"/></a></div></td><td class="openGraphContent"><div><h2 id="title">'+json.hybridGraph.title+'</h2><span id="description">'+json.hybridGraph.description+'</span></div></div></td></tr>'
            parentElement.after(addingText);
        });
      }
      else{
        addingText = '<tr style = "border:1px solid black"><td class="commentAns" colspan="2">'+str+"</td></tr>";
        parentElement.after(addingText);
      }
        $(this).parent().css("display","none");

  });
});

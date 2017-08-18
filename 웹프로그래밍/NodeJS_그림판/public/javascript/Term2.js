var mode = 0;//현재 mode를 알려주는 변수
var drawWidth = 1;//펜의 두께를 저장을 하는 변수
$(function() {
	socket = io();//socket을 사용을 하기 위한 객체
	var isDown = false;//Mouse Down 여부 확인
	var cvn = document.getElementById("myCanvas");
	var ctx = cvn.getContext('2d');//Canvas태그의 context를 ctx변수에 저장
	var sx = 0;//시작 x 좌표를 저장하는 변수
	var sy = 0;//시작 y 좌표를 저장하는 변수
	var DATA = [];//그려진 선과 도형에 관한 정보들이 저장이 되는 변수
	var NEWDATA = [];//packet으로 보내질 정보들이 저장이 되는 변수
	var n;//DATA변수의 크기를 저장하는 변수
	var newDataLength;//newDATA변수의 크기를 저장하는 변수
	socket.emit("start",);//처음 시작시 start라고하는 packet을 전송하여 다른 client에서 그린 그림에 대한 정보를 가져온다.
	$("#myCanvas").mousedown(function(e) {//canvas를 마우스로 클릭 하였을 떄의 이벤트
		if(mode != 0 || mode != 4){//선 펜과 지우개 사용이 아닐 시에는 마우스를 클릭 하였을때 n과 newDataLength의 크기가 정해져야 한다
			n = DATA.length;
			newDataLength = NEWDATA.length
		}
		var ev = ev || event;
		sx = ev.clientX;//마우스로 클릭한 장소의 x좌표를 저장
		sy = ev.clientY;//마우스로 클릭한 장소의 y좌표를 저장
		isDown = true;//마우스가 눌려있다는것을 표시
	});
	$("#myCanvas").mousemove(function(e) {
		var ev = ev || event;
		var ex = ev.clientX;//끝나는 x좌표를 저장
		var ey = ev.clientY;//끝나는 y좌표를 저장
		var drawColor = document.getElementById("colors").value;//색깔을 저장하는 변수
		if (isDown) {
			if (mode == 0) {//mode가 선 펜이었을 떄
				n = DATA.length;//선 펜은 여려개의 점이 이어져 만들어 짐으로 클릭시 n의 크기가 정해져야 한다.
				DATA[n] = new Object();//객체 생성
				DATA[n].sx = sx;//시작 x 지점 저장
				DATA[n].sy = sy;//시작 y 지점 저장
				DATA[n].ex = ex;//끝 x 지점 저장
				DATA[n].ey = ey;//끝 y 지점 저장
				DATA[n].c = drawColor//색깔 저장
				DATA[n].attr = 'point-line';//render에서 사용할 식별자 저장
				DATA[n].w = drawWidth;//두께 저장
				NEWDATA.push(DATA[n]);//객체에 대한 정보를 NEWDATA변수에 저장
				ctx.beginPath();//선 그리기 시작
				ctx.moveTo(sx - 130, sy - 95);//시작점이동
				ctx.lineTo(ex - 130, ey - 95);//끝나는 점까지 선 긋기
				ctx.closePath();//그리기 끝
				ctx.strokeStyle = drawColor;//그림을 그릴때의 색깔 지정
				ctx.lineJoin = 'round';//두개의 선이 만났을때 둥근 코너를 만든다.
				ctx.lineCap = 'round';//양쪽 끝이 둥글다.
				ctx.lineWidth = drawWidth;//그림을 그릴 때 두께 저장
				ctx.stroke();//canvas에 설정한 선을 그린다.
				sx = ex;//시작 x좌표를 갱신
				sy = ey;//시작 y좌표를 갱신
				render();
			} else if (mode == 1) {
				DATA[n] = new Object();//객체 생성
				DATA[n].sx = sx;//시작 x 지점 저장
				DATA[n].sy = sy;//시작 y 지점 저장
				DATA[n].ex = ex;//끝 x 지점 저장
				DATA[n].ey = ey;//끝 y 지점 저장
				DATA[n].c = drawColor;//색깔 저장
				DATA[n].attr = 'line';//render에서 사용할 식별자 저장
				DATA[n].w = drawWidth;//두께 저장
				NEWDATA[newDataLength] = DATA[n];//객체에 대한 정보를 NEWDATA변수에 저장
				render();
			}
			else if(mode == 2){

				var cx = ex- sx;//원의 중심 x점을 정한다
				var cy = ey - sy;//원의 중심 y점을 정한다.
				var R = Math.sqrt(cx*cx + cy*cy)/2;//원의 반지름을 정한다.
				DATA[n] = new Object();//객체 생성
				DATA[n].attr = 'circle';//render에서 사용할 식별자 저장
				DATA[n].x = cx/2 + sx;//시작 x 지점 저장
				DATA[n].y = cy/2 + sy;//시작 y 지점 저장
				DATA[n].r = R;//반지름 저장
				DATA[n].c = drawColor;//색깔 저장
				NEWDATA[newDataLength] = DATA[n];//객체에 대한 정보를 NEWDATA변수에 저장
				render();
			}
			else if(mode ==3){
				var cx = ex - sx;//사각형의 길이를 구한다.
				var cy = ey - sy;//사각형의 높이를 구한다.
				DATA[n] = new Object();//객체 생성
				DATA[n].attr = 'rect';//render에서 사용할 식별자 저장
				DATA[n].x = sx;//시작 x 지점 저장
				DATA[n].y = sy;//시작 y 지점 저장
				DATA[n].w = cx;//깊이 저장
				DATA[n].h = cy;//높이 저장
				DATA[n].c = drawColor;//색깔저장
				NEWDATA[newDataLength] = DATA[n];//객체에 대한 정보를 NEWDATA변수에 저장
				render();
			}
			else if(mode == 4){
				n = DATA.length;//지우개는 여려개의 흰 공간이 이어져 만들어 짐으로 클릭시 n의 크기가 정해져야 한다.
				DATA[n] = new Object();//render에서 사용할 식별자 저장
				DATA[n].attr = 'clear-rect';//render에서 사용할 식별자 저장
				DATA[n].x = ex;//시작 x 지점 저장
				DATA[n].y = ey;//시작 y 지점 저장
				DATA[n].w = 30;//깊이 저장
				DATA[n].h = 30;//높이 저장
				DATA[n].c = '#fff';//하얀색저장
				NEWDATA.push(DATA[n]);//객체에 대한 정보를 NEWDATA변수에 저장
				ctx.fillStyle = '#fff';//사각형을 하얀색으로 채워 넣는다.
				ctx.beginPath();//그리기 시작
				ctx.fillRect(ex-130,ey-95,30,30);//사각형 만들기
				ctx.closePath();//그리기 끝
				ctx.fill();//canvas에 채운다.
			}
		}
	});
	$("#myCanvas").mouseup(function(e) {//마우스를 떼었을 떄의 이벤트
		isDown = false;//isDown을 false로 바꿔 줌으로서 마우스를 더이상 누르고 있지 않다는 것을 저장.
		socket.emit('s',NEWDATA);//자신이 한 작업들이 저장된 NEWDATA의 정보를 socket을 이용하여 서버로 전송
		NEWDATA = [];//NEWDATA 를 비워준다.
	});
	function render(){
		ctx.clearRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight);//canvas의 크기 만큼 하얀색 사각형으로 뒤 덮는다.
		for(var i=0; i<DATA.length; i++){//DATA의 크기만큼 반복문 수행
			switch(DATA[i].attr){//DATA의 attr로 어떠한 mode인지 식별을 하여 이전에 그렸던 그림들을 다시 그려 준다.
				case 'clear-rect'://지우개의 이벤트는 rect와 똑같다.
				case 'fill-rect'://fill-rect 이벤트는 rect와 똑같다.
				case 'rect':
					ctx.beginPath();//그리기 시작
					ctx.fillStyle = DATA[i].c;//색깔 지정
					ctx.fillRect(DATA[i].x-130,DATA[i].y-95,DATA[i].w,DATA[i].h);//저장이 되어있는 데이터로 사각형을 만든다.
					ctx.closePath();//그리기 끝
					ctx.fill();//사각형을 canvas에 그린다.
					break;
				case 'circle':
					ctx.beginPath();//그리기 시작
					ctx.fillStyle = DATA[i].c;//색깔 지정
					ctx.arc(DATA[i].x-130,DATA[i].y-95,DATA[i].r,0,2*Math.PI,false);//저장이 되어있는 데이터로 원을 만든다.
					ctx.closePath();//그리기 끝
					ctx.fill();//원을 canvas에그린다.
					break;
					case 'point-line'://point-line은 길이가 짧은 line 임으로 line과 같은 방식으로 그려진다.
					case 'line':
						ctx.beginPath();//그리기 시작
						ctx.moveTo(DATA[i].sx-130,DATA[i].sy-95);//시작점 설정
						ctx.lineTo(DATA[i].ex-130,DATA[i].ey-95);//도착점이랑 시작점을 이어서 선을 그린다.
						ctx.closePath();//그리기 종료
						ctx.lineJoin = "round";//두개의 선이 만났을때 둥근 코너를 만든다.
						ctx.lineCap = 'round';//양쪽 끝을 둥글게 만든다.
						ctx.strokeStyle = DATA[i].c;//선의 색깔 설정
						ctx.lineWidth = DATA[i].w;//선의 두께 설정
						ctx.stroke();//선을 긋는다.
					break;
			}
		}
	}
	$("#clearButton").click(function() {//clear 버튼을 눌렀을 시에 이벤트 처리
		n = DATA.length;//DATA의 크기 저장
		DATA[n] = new Object();//새로운 객체 생성
		DATA[n].attr = 'clear-rect';//render에서의 식별자로 사용하기 위해 사용
		DATA[n].x = 0;//시작 x 지점 저장
		DATA[n].y = 0;//시작 y 지점 저장
		DATA[n].w = document.documentElement.clientWidth;//길이를 canvas의 길이로 설정
		DATA[n].h = document.documentElement.clientHeight;//높이를 canvas의 높이로 설정
		DATA[n].c = '#fff';//색깔을 하얀색으로 설정
		NEWDATA.push(DATA[n]);//NEWDATA변수에 설정한 DATA값을 저장한다.
		ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);//canvas의 크기만큼 하얀 사각형을 만들어서 화면을 초기화 시켜준다.
		socket.emit('reset',NEWDATA);//서버에 reset이라고 하는 packet을 보낸다.
		DATA = [];//DATA 초기화
		NEWDATA = [];//NEWDATA 초기화
	});
	$("#fill").click(function(){//색채우기를 눌렀을 시 발생하는 이벤트
		var n = DATA.length;//DATA의 크기 저장
		DATA[n] = new Object();//객체 생성
		DATA[n].attr = 'fill-rect';//render에서의 식별자로 사용하기 위해 사용
		DATA[n].c =document.getElementById("colors").value;//사용자가 지정한 색깔을 canvas를 채우는 색깔로 설정
		DATA[n].x = 0;//전체 범위 임으로 시작 위치는 0이다.
		DATA[n].y = 0;
		DATA[n].w = document.documentElement.clientWidth;//사각형의 길이는 canvas의 길이 저장
		DATA[n].h = document.documentElement.clientHeight;//사각형의 높이는 canvas의 높이 저장
		NEWDATA.push(DATA[n]);//NEWDATA변수에 위에서 저장한 정보를 저장한다.
		ctx.fillStyle = document.getElementById("colors").value;//사용자가 지정한 색깔을 canvas를 채우는 색깔로 설정
		ctx.fillRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight)//canvas의 크기 만큼 사각형을 만든다.
		socket.emit('s',NEWDATA);//NEWDATA를 socket을 이용을 하여 전송
		NEWDATA = [];//NEWDATA 초기화
	});
	$("#save").click(function(){//save버튼을 눌렀을시에 이벤트
		var link = document.createElement("a");//a태그 생성
		link.download= "canvas.png";//다운로드 시의 이름을 설정
		link.href = cvn.toDataURL("image/png");//canvas의 데이터를 다운 받을 대상으로 설정
		link.click();//생성한 a태그를 클릭
	});
	$("#tranButton").click(function(){//chatting벼튼을 눌렀을 때의 이벤트
		if($("#content").val() != ""){
		var name = $('#name').val();//id name을 가지고 있는 태그의 값을 저장한다.
		var msg = $('#content').val();//id content를 가지고 있는 태그의 값을 저장한다.
		$('#chat-content').append(name+" :"+msg+"\n");//textarea에 내용 추가
		$('#content').val("");//content의 내용을 비운다.
		socket.emit('user',{//socket을 이용하여 DATA을 전송
			name : name,
			message : msg
		});
		}
	});
	$('#content').keydown(function(key){//content의 key가 입력 받아졌을때 처리되는 이벤트
		if(key.keyCode == 13 && $('#content').val() != ""){//enter가 입력 되었을 때 chatting 버튼이 눌려지는 이벤트 발생
			$('#tranButton').click();
		}
	});
	socket.on('s',function(line) {//s라고 하는 패킷이 도착하면 DATA에 전송이 되어진 정보를 저장한다.
		for(var i=0;i < line.length;i++){
			DATA.push(line[i]);
		}
		render();
	});
	socket.on('system',function(data){//system 이라고 하는 패킷이 도착하면 text-area 를 초기화 하고 전달된 정보를 출력
		$('#chat-content').html('');
		$('#chat-content').append("system :"+data+"\n");
	})
	socket.on('change name',function(name){//change name이라고 하는 패킷이 도착하면 name이라고 하는 id를 가진 태그의 value값을 전송이 되어진 data로 한다.
			$("#name").val(name);
	});
	socket.on('message',function(data){//message 라고 하는 패킷이 도착하면 이벤트 처리
		var name = data.name;//얻어온 data객체의 name값을 변수에 저장
		var message = data.message;//data객체의 message값을 변수에 저장
		$('#chat-content').append(name+" :"+message+"\n");//textarea에 받아온 데이터들을 가공하여 출력
		$('#chat-content').scrollTop($('#chat-content').height());//textarea의 스크롤을 믿으로 내려준다.
	});
});
function changeMode(value) {//매개변수로 온 value값을 mode의 값으로 설정
	mode = value;
}

function changeWidth(width){//매개변수로 온 width를 drawWidth의 값으로 설정한다.
	drawWidth = width;
}

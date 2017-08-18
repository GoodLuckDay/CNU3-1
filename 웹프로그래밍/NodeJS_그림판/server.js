var express = require("express");//express 프레임워크의 모듈을 불러온다.
var app = express();//express()함수를 이용을 하여 app객체 생성
http = require('http').Server(app);//http서버와 app객체를 연결
var io = require("socket.io")(http);//http서버와 io객체를 연결
var fs = require('fs');//fs 모듈을 불러온다.

app.set('port',(process.env.PORT || 5000));//PORT번호 설정
app.use(express.static(__dirname + '/public'));//css와 javascript를 사용하기 위해서 static 파일의 위치를 지정.
app.get('/',function(req,res){//웹브라우저 접속시 매번 실행
	fs.readFile("TP2.html",function(err,data){//fs모듈을 이용하여 TP2.html파일을 읽는다.
		res.send(data.toString());//응답객체를 이용을 하여 읽은 파일을 브라우저에 뿌려준다.
	});
});
var count = 1;//입장한 순서를 알려주는 변수
var lines = [];//도중 참가한 사람들도 그려진 그림을 보여주기 위해서 만든 변수
io.on("connection", function(s){
	var name = "user"+count++;//user 설정
	s.emit('system',"채팅방에 오신것을 환영합니다.");//연결된 패킷에게 알림 메세지를 전송
	s.emit('change name',name);//연결된 패킷에게 몇번째로 참가하였는지에 대해서 알려준다.
	s.on('s',function(line){
		for(var i=0;i<line.length;i++){//사용자들이 그림을 그릴 때 보내진 정보들을 모두 lines변수에 저장
			lines.push(line[i]);
		}
		s.broadcast.emit('s',line);});//s라고 하는 패킷이 오면 s라는 이름으로 전체에게 브로드 캐스트로 데이터를 전송을 한다.
	s.on('start',function(line){
		s.emit('s',lines);//start라는 packet이 오면 start라고 하는 패킷으로 lines변수의 값을 전송
	});
	s.on('user',function(data){
		s.broadcast.emit('message',data);//채팅 창을 구현하기 위해서 채팅 메세지가 담긴 소켓이 전송이 되어져 오면
	});//breadcast로 연결된 소켓들에게 전송
	s.on('reset',function(line){//reset packet 신호가 오면
		s.broadcast.emit('s',line);
		lines = [];//lines 초기화
	});
});
http.listen(app.get('port'),function(){
	console.log("SERVER ON!")
});//http 서버를 기동

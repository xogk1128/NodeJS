var M ={
    v : 'V',
    f:function(){
        console.log(this.v);
    }
}

// 모듈이 담겨있는 mparts.js라는 파일에 있는 기능들
// 중에서 M이라는 객체를 외부에서 사용할 수 있게 한다.
module.exports = M;
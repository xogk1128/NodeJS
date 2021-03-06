var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('node:querystring');
var template = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    // 홈 화면
    if(pathname === '/'){
      if(queryData.id === undefined){

        fs.readdir('data', 'utf8',function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello Nodejs';
          
          var list = template.List(filelist);

          var html = template.HTML(title, list,
             `<h2>${title}</h2><p>${description}</p>`,
             `<a href = "/create">create</a>`);

          response.writeHead(200);
          response.end(html);
        });
          
      } else { //id가 있는 경우
        fs.readdir('./data', 'utf8',function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            
            //data폴더의 파일들 가져와서 출력
            var list = template.List(filelist);
            
            var title = queryData.id;
            var html = template.HTML(title, list, `<h2>${title}</h2><p>${description}</p>`,
            `<a href = "/create">create</a>
            <a href = "/update?id=${title}"> updata</a>
            <form action="/delete_process" mathod="post">
              <input type = "hidden" name="id" value = "${title}">
              <input type = "submit" value = "delete">
            </form>
            `);
            response.writeHead(200);
            response.end(html);
          });
        });
      }
      // 생성하기(create)
    } else if(pathname === '/create'){
      fs.readdir('data', 'utf8', function(error, filelist){
        var title = 'WEB - create';
        var description = 'Hello Nodejs';
        var list = template.List(filelist);

        var html = template.HTML(title, list,
           `
          <form action="http://localhost:3000/create_process">
           <p><input type="text" name="title" placeholder="title"></p>
           <p>
            <textarea name="description" placeholder="description"></textarea>
           </p>
           <p>
            <input type="submit" value="전송">
            </p>
          </form>
           `,'');

        response.writeHead(200);
        response.end(html);
      });
      // 전송하였을 때
    }else if(pathname === '/create_process'){
      var body='';
      // 웹브라우저가
      request.on('./data',function(data){
        body = body + data;
        console.log('why');
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
      // 수정하기(update)
    } else if(pathname === '/update'){
      fs.readdir('./data', 'utf8',function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          
          //data폴더의 파일들 가져와서 출력
          var list = template.List(filelist);
          
          var title = queryData.id;

          //사용자가 수정을 할 때 title의 내용을 바꾸면 수정하려는 파일과 이름이 달라지기때문에 불러오지 못함
          var html = template.HTML(title, list, 
          `
          <form action="/update_process">
            <input type="hidden" name = "id" value = "${title}">
            <p>
             <input type="text" name="title" placeholder="title" value=${title}>
            </p>
            <p>
             <textarea name="description" placeholder="description">${description}</textarea>
           </p>
           <p>
             <input type="submit" value="전송">
            </p>
          </form>
          `,
          `<a href = "/create">create</a><a href = "/update?id=${title}"> updata</a>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body='';
      // 웹브라우저가
      request.on('./data',function(data){
        body = body + data;
      });
      request.on('end',function(){
        var post = qs.parse(body);

        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`,function(err){
          fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        })
        
     });
    } else if(pathname === '/delete_process'){
      var body='';
      // 웹브라우저가
      request.on('./data',function(data){
        body = body + data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`,function(err){
          response.writeHead(302, {Location: `/`});
          response.end();
        });
     });
    } else{
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
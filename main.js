var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body){
  return  `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';

  var i=0;
  while(i<filelist.length){
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }

  list += '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if(pathname === '/'){
      if(queryData.id === undefined){

        fs.readdir('data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello Nodejs';
          /*
          var list = `
            <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>`;
            */
          var list = templateList(filelist);

          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);

          response.writeHead(200);
          response.end(template);
        });
          
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            
            //data폴더의 파일들 가져와서 출력
            var list = templateList(filelist);
            
            var title = queryData.id;
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('data', function(error, filelist){
        var title = 'WEB - create';
        var description = 'Hello Nodejs';
        var list = templateList(filelist);

        var template = templateHTML(title, list,
           `
          <form action="http://localhost:3000/process create">
           <p><input type="text" name="title" placeholder="title"></p>
           <p>
            <textarea name="description" placeholder="description"></textarea>
           </p>
           <p>
            <input type="submit" value="전송">
            </p>
          </form>
           `);

        response.writeHead(200);
        response.end(template);
      });
    }else{
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);

/*
Copyright (c) 2016 Yuri Fukuda

Permission is hereby granted, free of charge, 
to any person obtaining a copy of this software 
and associated documentation files (the "Software"), 
to deal in the Software without restriction, 
including without limitation the rights to 
use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to 
do so, subject to the following conditions:

The above copyright notice and this permission 
notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", 
WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
AMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
IN THE SOFTWARE.

 */

var http = require('http'),
    url = require('url'),  
    path = require('path'),  
    fs = require('fs');
  
var pfile = "server.pid"

var rootPath = process.cwd();
var port     = 8080;
var noCache  = false;
process.argv.forEach((val, index) => {
  if( val == "--path" )
  {
    rootPath = process.argv[index+1];
  }
  if( val == "--port" )
  {
    try{ 
      port = parseInt( process.argv[index+1] );
    } catch ( e ) {
      console.log( 'cound parse the port. Needs to be number' + e );
    }
  }
  if( val == "--noCache" )
  {
    noCache = true;
  }

});

console.log(`rootPath = ${rootPath} port = ${port}`);

http.createServer(function(request, response) {
  var requestUrl = url.parse(request.url, true);
  var filename = path.join( rootPath , (requestUrl.pathname == '/' ? '/index.html' : requestUrl.pathname));
  let knownMappingToContentTypes = {
      'css'  : 'text/css',
      'html' :  'text/html',
      'svg"' : 'image/svg+xml',
      'apk'  : 'application/vnd.android.package-archive'
      }

  fs.readFile(filename, 'binary', function(err, file) {  
    var header   = {};
    var status   = 200;
    var content  = null;
    var encoding = 'utf8';
    
    if (err) {  
      status = 500;
      header['Content-Type'] = 'text/plain';
      content                = err + '\n';
      console.log('GET ' + requestUrl.pathname + requestUrl.search + ' 500 ' + err);
    }
    else {
      let keys = Object.keys( knownMappingToContentTypes ); 
      if( noCache ) {
        header['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        header['Pragma']        = 'no-cache';
        header['Expires']       = 0;
      }
      encoding = 'binary';
      for( let i = 0; i < keys.length; i++ ) {
        let key = keys[i];
        let contentType = knownMappingToContentTypes[ key ];
        // if it's a known type apply content type
        if( filename.indexOf('.' + key) > 0 ) {
          header['Content-Type'] = contentType;
          break;
        }
      }
      content = file;
      console.log('GET ' + requestUrl.pathname + requestUrl.search + ' 200');
    }
    response.writeHead( status, header );  
    response.write( content, encoding );  
    response.end();  
  });
}).listen(port, function(){
  console.log(`Server running at http://localhost:${port}/`);
  var pid = ""+process.pid; // need to turn into a string
  // remove file if it exists
  removePIDFile();
  fs.writeFileSync(pfile, pid) 
  console.log('This process is pid ' + pid + ' is written in ' + process.cwd()  + "/" + pfile );
});

process.on('SIGTERM', function() {
  removePIDFile();
  console.log('Received Signal');
  process.exit(1);
});

process.on('uncaughtException', function(ex) {
  console.log('caught ' + ex);
}); 

removePIDFile = function(){
  if ( fs.existsSync(pfile) ){
      console.log( pfile + " exists. - removing file");
      fs.unlinkSync(pfile)
      console.log(pfile + ' removed');
  }
  else{
      console.log( pfile + " doesn't exists");
  }
};

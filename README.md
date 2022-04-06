# node-http-server

Simple static http server for your local work. 

## Installation
1. Install node ( requires V4+ )
2. run 

## Usage

   node server.js
   
   options: 
   --port hosted port
       if you don't specify it will be defaulted to 8080

   --path root path  
   
       root directry to serve the content. Otherwise
   
       it will serve from current directry

   --noCache 
   
      It will serve static file with no cache control.

   --https

      It will enable https server. Make suer you create key 
      and cer file by adding argument 
      --certPath < certPath locaion > --keyPath < key path locaion >
      

      i.e. 


 
			 ```
			openssl genrsa -out key.pem
			openssl req -new -key key.pem -out csr.pem
			openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
			rm csr.pem
			```


   --certPah < cert path locaion >

      define where is cert file 



   --keyPath < key path locaion >

      define where is key file 



      
## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

08/12/2016 Yuri Fukuda  created

10/20/2017 Yuri Fukuda updated content type mapping
 
08/22/2020 Yuri Fukuda Supported ssl & range request

## License
Under MIT License. 

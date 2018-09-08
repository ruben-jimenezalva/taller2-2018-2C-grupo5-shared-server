Install Docker
==============

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04


Build & Run 
============

Dentro de cada respectivo modulo:

sudo docker build -t <MODULO> .

Desarrollo(Single App)
===================
Correr la imagen con:

$ cd shared-server
$ sudo docker build -t shared-server .
$ sudo docker run --rm -v "$(pwd)/service":/app/service -p 8080:8080 shared-server 

Desarrollo (Full System)
=======================
Para el ambiente de desarrollo utilizamos un override, que permite hacer hotrealod del código.

$ sudo docker-compose build
$ sudo docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
 


 

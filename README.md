Travis CI
==========
[![Build Status](https://travis-ci.org/rubenJimenez33/taller2-2018-2C-grupo5-shared-server.svg?branch=master)](https://travis-ci.org/rubenJimenez33/taller2-2018-2C-grupo5-shared-server)


Install Docker
==============

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04


Desarrollo (Full System)
=======================
Dentro del modulo:
Para el ambiente de desarrollo utilizamos un override, que permite hacer hotrealod del código.

$ sudo docker-compose build
$ sudo docker-compose up shared-server

Testing
=======================
Dentro del modulo:
Para el ambiente de desarrollo utilizamos un override, que permite hacer hotrealod del código.

$ sudo docker-compose build
$ sudo docker-compose up -d shared-server
$ sudo docker-compose up test-server
 
Consultas desde curl
=========================

 $ curl -X POST "http://localhost:8080/api/servers" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{ \"createdBy\": \"anyUser\",\"name\": \"nameServer\"}"

 $ curl curl -X GET "http://localhost:8080/api/servers" -H  "accept: application/json" -H "access-token: token"

 $ curl curl -X DELETE "http://localhost:8080/api/servers/id" -H  "accept: application/json" -H "access-token: token"

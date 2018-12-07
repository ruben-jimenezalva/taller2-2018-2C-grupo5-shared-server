Travis CI
==========
[![Build Status](https://travis-ci.org/rubenJimenez33/taller2-2018-2C-grupo5-shared-server.svg?branch=master)](https://travis-ci.org/rubenJimenez33/taller2-2018-2C-grupo5-shared-server)


Coverage
=========
[![Coverage Status](https://coveralls.io/repos/github/rubenJimenez33/taller2-2018-2C-grupo5-shared-server/badge.svg?branch=master)](https://coveralls.io/github/rubenJimenez33/taller2-2018-2C-grupo5-shared-server?branch=master)



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

$ sudo docker-compose up postgres
$ mv shared-server
$ sudo npm run cover
$ sudo docker stop $(sudo docker ps -a -q)
 

Before Deploy
=======================
Si no existe crear la base de datos.
Dentro del directorio donde se escuentra el script de la base de datos:
heroku pg:psql postgresql-animate-75510 --app shared-server-taller2-2c-2018 -f database.sql


Deploy
=======================
Dentro del modulo donde se encuentra el Dockerfile de la app

$ heroku git:remote -a shared-server-taller2-2c-2018
$ heroku container:push web
$ heroku container:release web
$ heroku open


Consultas desde curl
=========================

url_production = https://shared-server-taller2-2c-2018.herokuapp.com/

url_developed =http://localhost:8080/


 $ curl -X POST "url_ambiente" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{ \"createdBy\": \"anyUser\",\"name\": \"nameServer\"}"

 $ curl curl -X GET "url_ambiente" -H  "accept: application/json" -H "access-token: token"

 $ curl curl -X DELETE "url_ambiente -H  "accept: application/json" -H "access-token: token"


 docker exec -tiu postgres container-postgres psql
  connections: SELECT query,query_start,usename,state FROM pg_stat_activity;

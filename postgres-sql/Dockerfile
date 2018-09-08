FROM postgres
ADD database.sql /docker-entrypoint-initdb.d/
COPY . .
EXPOSE 5432


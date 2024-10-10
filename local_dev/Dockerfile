FROM postgres:latest

# scripts copied here are run first time container is started
COPY ./scripts/ /docker-entrypoint-initdb.d/

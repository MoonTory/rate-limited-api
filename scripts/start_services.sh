#!/bin/bash
if [ "$ENV" = "development" ]
then
    cp docker-compose.dev.yml docker-compose.temp.yml
else
    cp docker-compose.yml docker-compose.temp.yml
fi

docker-compose -f docker-compose.temp.yml up

# Optionally, you can remove the temporary file after use
rm docker-compose.temp.yml

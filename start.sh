#!/bin/bash                                                                    

#!/bin/bash 

REDCOLOR="\e[31m"
GREENCOLOR="\e[32m"
YELLOWCOLOR="\e[33m"
ENDCOLOR="\e[0m"

clear
echo -e "${REDCOLOR}Stopping the latest docker container...${ENDCOLOR}"
sudo docker stop node-auth-api
echo -e "${GREENCOLOR}Docker container has stopped ✔${ENDCOLOR}"
echo -e "================================================"
echo -e "${YELLOWCOLOR}Building new docker container...${ENDCOLOR}"
sudo docker build -t node-auth-api-app .
echo -e "${GREENCOLOR}Docker container successfully build ✔${ENDCOLOR}"
echo -e "================================================"
echo -e "${YELLOWCOLOR}Running updated docker container...${ENDCOLOR}"
sudo docker run -d --name node-auth-api -it --rm -p 9000:1131 node-auth-api-app
sudo docker ps -a
echo -e "${GREENCOLOR}Docker container successfully running on port 9000! ✔${ENDCOLOR}"
echo -e "${GREENCOLOR}Application successfully deployed! ✔${ENDCOLOR}"
                                                                               

FROM node:8.7.0

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y \
    ttf-* --no-install-recommends

RUN apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget --no-install-recommends && \
    apt-get clean && apt-get autoremove -y

RUN mkdir -p /opt/puppy 

RUN cd /opt/puppy && npm init -f \
    && npm i puppeteer http --save

COPY ./scripts/index.js /opt/puppy/index.js

RUN chown -R node:node /opt/puppy
WORKDIR /opt/puppy
USER node

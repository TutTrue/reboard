#!/bin/bash
git pull
cd client
npm i &
client_install_pid=$!
wait $client_install_pid
npm run dev &
cd ..
cd server
npm i &
server_install_pid=$!
wait $server_install_pid
npm run dev &
open http://localhost:3000 &

#!/bin/bash
npm run build

if [ $? -ne 0 ]; then
	exit 1
fi

current_dir=$(realpath $(dirname $0))

# If ./build/data.json isn't linked yet, link it
if [ ! -L ./build/data.json ]; then
  ln -s "${current_dir}/data.json" ./build/data.json
fi

# If ./build/pages/ isn't linked yet, link it
if [ ! -L ./build/index.html ]; then
	ln -s "${current_dir}/static/index.html" ./build/index.html
fi

# If ./build/index.css isn't linked yet, link it
if [ ! -L ./build/index.css ]; then
	ln -s "${current_dir}/static/index.css" ./build/index.css
fi

# If ./build/Hitung Token PLN.jpeg isn't linked yet, link it
if [ ! -L "./build/Hitung Token PLN.jpeg" ]; then
	ln -s "${current_dir}/repo-image/Hitung Token PLN.jpeg" "./build/Hitung Token PLN.jpeg"
fi
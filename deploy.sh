#!/usr/bin/env bash
set -eu

APP=app-$(date +%Y%m%d-%H%M%S)-$(git log --pretty=format:"%H" -1 | cut -c 1-12)

docker build --platform linux/amd64 -t botan:latest .
docker create --name dummy botan:latest
docker cp dummy:/app ~/tmp/$APP
docker rm dummy

cd ~/tmp
# macで圧縮ファイルをlinuxで解凍した際にエラーが出るのを抑制するためformatを指定
# https://sig9.org/blog/2023/12/15/
tar --format ustar -zcf $APP.tar.gz $APP
rm -r $APP
scp $APP.tar.gz $HOST:~/deploy
rm $APP.tar.gz

ssh $HOST /bin/bash << EOF
cd ~/deploy
tar zxvf $APP.tar.gz
rm $APP.tar.gz
sudo chown -R www-data:www-data $APP
sudo mv $APP /var/www/botan
cd /var/www/botan
sudo ln -snf $APP app
sudo systemctl restart botan
sudo systemctl status botan
EOF

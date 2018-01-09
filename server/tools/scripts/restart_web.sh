cd /var/www2
git reset --hard
git pull origin master
msg=`git log -1 --pretty=%B | tr -s ' ' | tr ' ' '_'`

cd /var/www2/server/services
cp -uv * /etc/systemd/system/

systemctl daemon-reload
systemctl restart garage_server_web.service

echo 'HEAD is now '$msg
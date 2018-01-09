cd /var/www/garage
git reset --hard
git pull origin master
msg=`git log -1 --pretty=%B | tr -s ' ' | tr ' ' '_'`

cd /var/www/garage/client/services
cp -uv * /etc/systemd/system/

systemctl daemon-reload
systemctl restart garage_client_web.service

echo 'HEAD is now '$msg
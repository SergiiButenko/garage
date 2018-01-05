cd /var/www/garage
git reset --hard
git pull origin master
msg=`git log -1 --pretty=%B | tr -s ' ' | tr ' ' '_'`

cd /var/www/garage/services
cp -uv * /etc/systemd/system/

systemctl daemon-reload
systemctl restart web.service

echo 'HEAD is now '$msg
docker compose down
docker compose up -d --build
docker compose exec web python manage.py migrate --noinput
docker compose exec web python manage.py collectstatic --no-input --clear

sudo pkill -9 nginx
sudo nginx -c /home/analyst/floxesPage/nginx/nginx.conf
sudo chown -R analyst:www-data /home/analyst/floxesPage/staticfiles
sudo chmod -R 750 /home/analyst/floxesPage/staticfiles

docker compose logs -f
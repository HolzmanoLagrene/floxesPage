sudo pkill -9 nginx
sudo nginx -c /home/analyst/floxesPage/nginx/nginx.conf
docker compose down
docker compose up -d --build
docker compose exec web python manage.py migrate --noinput
docker compose exec web python manage.py collectstatic --no-input --clear
docker compose logs -f

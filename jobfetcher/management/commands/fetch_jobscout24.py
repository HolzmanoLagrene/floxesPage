from django.core.management import BaseCommand

from Scrapers.jobscout_24_scraper import JobScout24Scraper


class Command(BaseCommand):
    help = "Fetch latest data"

    def handle(self, *args, **options):
        js = JobScout24Scraper()

        js.fetch_jobs(search_terms=["Arzt","Anwalt","Jurist"],pensum=[20,80])

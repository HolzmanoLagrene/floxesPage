import time
from typing import List, Tuple
from bs4 import BeautifulSoup
import requests

from Scrapers.job_scraper import JobScraper
from tindershow.models import JobScout24Job


class JobScout24Scraper(JobScraper):

    def __init__(self):
        self.base_url = "https://www.jobscout24.ch/de/jobs"
        self.jobs_list = set()

    def __create_url__(self, search_terms: List[str], page: int, pensum: Tuple[int, int]):
        search_url = f"/{'%20or%20'.join([term.lower() for term in search_terms])}" \
                     f"/?regidl=2&sort=1&p={str(page)}&wt={pensum[0]}-{pensum[1]}"
        return self.base_url + search_url

    def __parse_job_offer__(self, soup_object):
        return JobScout24Job.create_from_soup(soup_object)

    @staticmethod
    def __get_number_of_pages__(bs_object):
        pagination = bs_object.find("div", {"class": "pages"})
        if pagination:
            return int(pagination.text.strip().split(" ")[-1])
        else:
            return 0

    def __fetch_available_jobs__(self, terms, pensum):
        fetch_url = self.__create_url__(terms, 1, pensum)
        response = requests.get(fetch_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        number_of_pages = self.__get_number_of_pages__(soup)
        jobs_list_new = [self.__parse_job_offer__(job) for job in soup.findAll("li", {"class": "job-list-item"})]
        if number_of_pages == 0:
            print(f"Exactly {len(jobs_list_new)} offers available.")
        else:
            print(f"Approximately {len(jobs_list_new) * number_of_pages} offers available.")
        for page in range(2, number_of_pages + 1):
            fetch_url = self.__create_url__(terms, page, pensum)
            response = requests.get(fetch_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            jobs_list_new += [self.__parse_job_offer__(job) for job in soup.findAll("li", {"class": "job-list-item"})]
            time.sleep(0.2)
        for job in jobs_list_new:
            if not JobScout24Job.objects.filter(job_id=job.job_id).exists():
                job.save()

    def fetch_jobs(self,**params):
        if "search_terms" in params:
            search_terms = params["search_terms"].split(",")
        else:
            return None
        if "pensum" in params:
            pensum = params["pensum"]
        else:
            return None
        self.__fetch_available_jobs__(search_terms,pensum)

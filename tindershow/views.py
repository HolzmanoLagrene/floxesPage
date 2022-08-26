import json

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
# Create your views here.
from django.template.loader import render_to_string, get_template

from Scrapers.jobscout_24_scraper import JobScout24Scraper
from floxesNewJob.settings import number_of_max_cards
from mailer.mailer import Mailer
from tindershow.forms import SearchTermsForm, SearchTerms
from tindershow.models import JobScout24Job

def show_tinder(request):
    # unknown_jobs = JobScout24Job.objects.filter(status="u").order_by('age')
    # liked_jobs = JobScout24Job.objects.filter(status="l").order_by('age')
    search_form_params = SearchTerms.objects.last()
    if not search_form_params:
        search_form_params = ""
    context = {
        'number_of_max_cards': number_of_max_cards,
        'search_form_params': search_form_params,
    }
    return render(request, 'tindershow/index.html', context=context)


def update_jobs(request):
    if request.method == 'POST':
        form = SearchTermsForm(request.POST)
        if form.is_valid():
            form.save()
            data = form.cleaned_data
            js = JobScout24Scraper()
            js.fetch_jobs(search_terms=data["search_terms"], pensum=[data["min_pensum"], data["max_pensum"]])
            search_form_params = SearchTerms.objects.last()
            return JsonResponse({"last_updated_on": search_form_params.query_time.strftime('%m/%d/%Y %H:%M:%S')}, safe=False)


def delete_all(self):
    JobScout24Job.objects.all().delete()
    return redirect('/')


def label_card(request):
    data = json.loads(request.read().decode("utf-8"))
    card = JobScout24Job.objects.filter(id=data["id"].split("_")[-1])
    card.update(status=data["status"])
    return HttpResponse(status=204)


def load_next_cards(request):
    data = json.loads(request.read().decode("utf-8"))
    blacklist = [x.split("_")[-1] for x in data["blacklist"] if x != ""]
    next_x_cards = JobScout24Job.objects.filter(status="u").exclude(pk__in=blacklist).order_by('age')[:data["number_of_cards"]]
    html = ""
    if len(next_x_cards) == 0 and not data["has_last"]:
        html = render_to_string('tindershow/last_card.html', {'unknown_jobs': next_x_cards})
    elif len(next_x_cards) > 0:
        html = render_to_string('tindershow/card_template.html', {'unknown_jobs': next_x_cards})
    return JsonResponse(html, safe=False)


def send_email(request):
    liked_jobs = JobScout24Job.objects.filter(status="l")
    message = get_template('mailer/email_template.html').render({'liked_jobs': liked_jobs})
    mailer = Mailer()
    mailer.send_mail(message)
    return redirect("/")

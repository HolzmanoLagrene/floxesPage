from django import forms
from django.forms import ModelForm

from tindershow.models import SearchTerms


class NameForm(forms.Form):
    search_terms = forms.CharField(label='search_terms', max_length=100)
    min_pensum = forms.IntegerField(label='min_pensum')
    max_pensum = forms.IntegerField(label='max_pensum')

class SearchTermsForm(ModelForm):
    class Meta:
        model = SearchTerms
        fields = "__all__"

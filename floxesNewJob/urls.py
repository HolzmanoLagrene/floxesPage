"""floxesNewJob URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include
from tindershow import views as tinder_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', tinder_views.show_tinder),
    path('submitForm', tinder_views.update_jobs),
    path('label_card', tinder_views.label_card),
    path('load_cards', tinder_views.load_next_cards),
    path('deleteAll', tinder_views.delete_all),
    path('sendEmail', tinder_views.send_email)
]


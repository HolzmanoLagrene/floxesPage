from django.conf import settings
from django.core.mail import EmailMessage


class Mailer:

    def __init__(self):
        pass

    def send_mail(self, message):
        subject = 'Thank you for registering to our site'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = ['lnzbmnn@gmail.com', ]
        mail = EmailMessage(subject, message, email_from, recipient_list)
        mail.content_subtype = "html"
        try:
            pt = mail.send(fail_silently=False)
        except:
            print(f"Email sending failed with error code {pt}")
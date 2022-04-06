from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


# Create your views here.
def test(request):
    return render(request, "api/chatApiTest.html")


def api_response(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "status": "login required"
        })
    return HttpResponse("Hello World")

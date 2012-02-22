from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt
from django.core.context_processors import csrf
from django.views.decorators.http import require_POST

import json

@csrf_exempt
@require_POST
def new(request):
    print request.POST['username']
    print request.POST['password']
    res = { "success": True }
    return HttpResponse(json.dumps(res))
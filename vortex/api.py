from vortex.models import *

from tastypie import fields
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS

class ConversationResource(ModelResource):
    author = fields.ForeignKey('accounts.api.UserResource', 'author', full=True)
    texts = fields.ToManyField('vortex.api.TextResource', 'texts', null=True)
    comments = fields.ToManyField('vortex.api.CommentResource', 'comments', null=True)
    council_members = fields.ToManyField('accounts.api.UserResource', 'council_members', full=True, null=True)
    
    class Meta:
        queryset = Conversation.objects.all()
        resource_name = 'conversation'
        filtering = {
            'author': ALL_WITH_RELATIONS,
            'council_members': ALL_WITH_RELATIONS
        }
        authentication = Authentication()
        authorization = Authorization()
    
    # force .json extension
    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('dispatch_list'), name="api_dispatch_list"),
            url(r"^(?P<resource_name>%s)/schema\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('get_schema'), name="api_get_schema"),
            url(r"^(?P<resource_name>%s)/set/(?P<pk_list>\w[\w/;-]*)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('get_multiple'), name="api_get_multiple"),
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
        ]

    def determine_format(self, request):
        if (hasattr(request, 'format') and
                request.format in self._meta.serializer.formats):
            return self._meta.serializer.get_mime_for_format(request.format)
        return super(ConversationResource, self).determine_format(request)

    def wrap_view(self, view):
        def wrapper(request, *args, **kwargs):
            request.format = kwargs.pop('format', None)
            wrapped_view = super(ConversationResource, self).wrap_view(view)
            return wrapped_view(request, *args, **kwargs)
        return wrapper

    # TODO: refactor this using DjangoAuthorization, I have no idea how to do that
    # Likely need to separate filtering against each parameter and then return the intersection
    def get_object_list(self, request):
        if request is not None:
            author = request.GET.get("author", None)
            council_members = request.GET.get("council_members", None)
            if author is None:
                if council_members is not None and int(council_members) == request.user.id:
                    return super(ConversationResource, self).get_object_list(request)
                else:
                    return super(ConversationResource, self).get_object_list(request).filter(public=True)
            else:
                if int(author) == request.user.id:
                    return super(ConversationResource, self).get_object_list(request)
                else:
                    if council_members is not None and int(council_members) == request.user.id:
                        return super(ConversationResource, self).get_object_list(request)
                    else:
                        return super(ConversationResource, self).get_object_list(request).filter(public=True)
        else:
            return super(ConversationResource, self).get_object_list(request)

class TextResource(ModelResource):
    author = fields.ForeignKey('accounts.api.UserResource', 'author', null=True, full=True)
    conversation = fields.ForeignKey('vortex.api.ConversationResource', 'conversation')
    
    class Meta:
        queryset = Text.objects.all()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'put', 'delete']
        resource_name = 'text'
        filtering = {
            'conversation': ALL_WITH_RELATIONS
        }
        authentication = Authentication()
        authorization = Authorization()

    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('dispatch_list'), name="api_dispatch_list"),
            url(r"^(?P<resource_name>%s)/schema\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('get_schema'), name="api_get_schema"),
            url(r"^(?P<resource_name>%s)/set/(?P<pk_list>\w[\w/;-]*)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('get_multiple'), name="api_get_multiple"),
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
        ]

    def determine_format(self, request):
        if (hasattr(request, 'format') and
                request.format in self._meta.serializer.formats):
            return self._meta.serializer.get_mime_for_format(request.format)
        return super(TextResource, self).determine_format(request)

    def wrap_view(self, view):
        def wrapper(request, *args, **kwargs):
            request.format = kwargs.pop('format', None)
            wrapped_view = super(TextResource, self).wrap_view(view)
            return wrapped_view(request, *args, **kwargs)
        return wrapper

class CommentResource(ModelResource):
    conversation = fields.ForeignKey('vortex.api.ConversationResource', 'conversation')
    author = fields.ForeignKey('accounts.api.UserResource', 'author')
    
    class Meta:
        queryset = Comment.objects.all()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'put', 'delete']
        resource_name = 'comment'
        filtering = {
            'conversation': ALL_WITH_RELATIONS
        }
        authentication = Authentication()
        authorization = Authorization()

    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('dispatch_list'), name="api_dispatch_list"),
            url(r"^(?P<resource_name>%s)/schema\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('get_schema'), name="api_get_schema"),
            url(r"^(?P<resource_name>%s)/set/(?P<pk_list>\w[\w/;-]*)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('get_multiple'), name="api_get_multiple"),
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)\.(?P<format>\w+)$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
        ]

    def determine_format(self, request):
        if (hasattr(request, 'format') and
                request.format in self._meta.serializer.formats):
            return self._meta.serializer.get_mime_for_format(request.format)
        return super(CommentResource, self).determine_format(request)

    def wrap_view(self, view):
        def wrapper(request, *args, **kwargs):
            request.format = kwargs.pop('format', None)
            wrapped_view = super(CommentResource, self).wrap_view(view)
            return wrapped_view(request, *args, **kwargs)
        return wrapper
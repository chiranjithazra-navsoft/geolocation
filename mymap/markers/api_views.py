"""Markers API views."""
from rest_framework import viewsets
from rest_framework_gis import filters

from markers.models import Marker
from markers.serializers import MarkerSerializer


class MarkerViewSet(viewsets.ReadOnlyModelViewSet):
    """Marker view set."""

    bbox_filter_field = "location"
    filter_backends = (filters.InBBoxFilter,)
    print(filter_backends)
    queryset = Marker.objects.all()
    print(queryset)
    serializer_class = MarkerSerializer

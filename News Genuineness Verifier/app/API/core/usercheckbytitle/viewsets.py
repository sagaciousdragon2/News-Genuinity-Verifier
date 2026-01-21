from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import UserCheckSerializer
from core.model import load_models

class UserCheckViewSet(viewsets.ViewSet):
    """Viewset to handle user checking other news."""
    http_method_names = ('post', )
    serializer_class = UserCheckSerializer
    nb_model, vect_model = load_models()

    def create(self, request):
        """Get's news from user and returns predicted value."""
        serializer = UserCheckSerializer(data=request.data)
        if serializer.is_valid():
            input_data_str = serializer.validated_data['user_news']
            
            # Simple heuristic for relevance: 
            # 1. At least 3 words
            # 2. At least 15 characters
            words = input_data_str.split()
            if len(words) < 3 or len(input_data_str) < 15:
                return Response({'prediction': None, 'status': 'irrelevant'})

            input_data = [input_data_str]
            vectorized_text = self.vect_model.transform(input_data)
            prediction = self.nb_model.predict(vectorized_text)
            prediction_bool = True if prediction[0] == 1 else False
            
            response_data = {'prediction': prediction_bool, 'status': 'success'}
            return Response(response_data)
        else:
            return Response(serializer.errors, status=400)

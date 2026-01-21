from rest_framework.response import Response
from rest_framework import viewsets, generics
from rest_framework import status

import requests

from bs4 import BeautifulSoup

from .models import LiveNews
from .serializers import LiveNewsSerializer, LiveNewsDetailedSerializer
from core.model import load_models

import threading
import time

def get_new_news_from_api_and_update():
    """Gets news from Indian sources using NewsAPI.org"""
    API_KEY = "a9d0f807f8364c40a93a988589c62aea"
    
    # Fetch from specific Indian news sources (works better with free tier)
    # Using 'everything' endpoint with Indian sources
    news_data = requests.get(
        f"https://newsapi.org/v2/everything?"
        f"sources=the-times-of-india&"
        f"pageSize=20&"
        f"apiKey={API_KEY}"
    )
    
    if news_data.status_code != 200:
        print(f"Error fetching news: {news_data.status_code}")
        return
    
    news_data = news_data.json()
    
    # Check if articles exist in response
    if news_data.get("status") != "ok" or not news_data.get("articles"):
        print("No articles found in response")
        return

    articles = news_data["articles"]
    
    # Extract data from NewsAPI response format
    news_titles = [article.get("title", "No Title") for article in articles]
    news_publication_dates = [article.get("publishedAt", "") for article in articles]
    news_categories = [article.get("source", {}).get("name", "General") for article in articles]
    section_names = [article.get("source", {}).get("name", "General") for article in articles]
    web_urls = [article.get("url", "") for article in articles]
    img_urls = [article.get("urlToImage", "None") for article in articles]

    nb_model, vect_model = load_models()

    for i in range(len(news_titles)):
        title_ = news_titles[i]
        publication_date_ = news_publication_dates[i]
        category_ = news_categories[i]
        section_name_ = section_names[i]
        web_url_ = web_urls[i]
        img_url_ = img_urls[i] if img_urls[i] else "None"
        
        # Skip if article already exists
        if not LiveNews.objects.filter(web_url=web_url_).exists():
            
            # Run ML prediction on the title
            vectorized_text = vect_model.transform([title_])
            prediction = nb_model.predict(vectorized_text)
            prediction_bool = True if prediction[0] == 1 else False

            print(f"Saving: {title_[:50]}... from {section_name_}")
            
            news_article = LiveNews(
                title=title_,
                publication_date=publication_date_,
                news_category=category_,
                prediction=prediction_bool,
                section_id=section_name_,  # Using source name as section_id
                section_name=section_name_,
                type="article",  # NewsAPI doesn't provide type, defaulting to "article"
                web_url=web_url_,
                img_url=img_url_
            )

            news_article.save()


def auto_refresh_news():
    get_new_news_from_api_and_update()
    

    interval = 300  # 5 minutes - to avoid hitting NewsAPI rate limits
    while True:
        print("Thread running! Fetching news from Indian sources...")
        get_new_news_from_api_and_update()
        time.sleep(interval)


auto_refresh_thread = threading.Thread(target=auto_refresh_news)
auto_refresh_thread.daemon = True
auto_refresh_thread.start()


class LiveNewsPrediction(viewsets.ViewSet):
    http_method_names = ('get', 'post', )

    def list(self, request):
        """Handles GET request by displaying all newly retrieved in database."""
        all_live_news = LiveNews.objects.all().order_by('-id')[:10]

        serializer = LiveNewsDetailedSerializer(all_live_news, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """Get's all data from a specific id in database."""
        try:
            news_prediction = LiveNews.objects.get(pk=pk)
        except LiveNews.DoesNotExist:
            return Response({"error": "News not found"}, status=404)
        
        serializer = LiveNewsDetailedSerializer(news_prediction)

        return Response(serializer.data, status=status.HTTP_200_OK)

class LiveNewsByCategory(viewsets.ViewSet):
    def list(self, request, category=None):
        if category is not None:
            live_news = LiveNews.objects.filter(news_category=category).order_by('-id')[:10]
            serializer = LiveNewsDetailedSerializer(live_news, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Category not provided in the URL'}, status=status.HTTP_400_BAD_REQUEST)
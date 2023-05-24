import requests
import json
from bs4 import BeautifulSoup

def generate_imdb_top_250_module():
    url = 'https://www.imdb.com/chart/top/'
    headers = {'Accept-Language': 'en-US,en;q=0.8'}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    movie_list = []
    movies = soup.select('.lister-list tr')

    for movie in movies:
        rank_element = movie.select_one('.titleColumn')
        rank = rank_element.get_text(strip=True).split('.')[0] if rank_element else ''

        title_element = movie.select_one('.titleColumn a')
        title = title_element.text.replace("'", "\'") if title_element else ''

        rating_element = movie.select_one('.imdbRating strong')
        rating = float(rating_element.text) if rating_element else 0.0

        movie_id = movie.find('td', class_='watchlistColumn').find('div')['data-tconst']
        movie_details = fetch_movie_details(movie_id)

        year = int(movie_details.get('year', '0')) if movie_details.get('year', '').isdigit() else 0
        director = movie_details.get('director', '')

        movie_data = {
            'rank': rank,
            'title': title,
            'rating': rating,
            'year': year,
            'director': director,
            'genre': ', '.join(movie_details.get('genres', [])),
            'summary': movie_details.get('summary', ''),
            'poster': movie_details.get('poster', ''),
            'scenesnap': movie_details.get('scenesnap', '')
        }

        movie_list.append(movie_data)

    js_module = 'module.exports = [\n'
    for movie in movie_list:
        js_module += '\t{ '
        js_module += ', '.join(f'{key}: {json.dumps(value, ensure_ascii=False)}' for key, value in movie.items())
        js_module += ' },\n'
    js_module += '];'

    return js_module

def fetch_movie_details(movie_id):
    # Add your TMDB API key here
    tmdb_api_key = 'Your API Key'

    url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={tmdb_api_key}&append_to_response=credits,images'
    response = requests.get(url)
    data = response.json()

    movie_details = {}

    if 'status_code' in data and data['status_code'] == 34:
        return movie_details

    movie_details['year'] = data.get('release_date', '').split('-')[0] if data.get('release_date') else ''
    movie_details['director'] = get_director(data)
    movie_details['genres'] = [genre['name'].replace("'", "\'") for genre in data.get('genres', [])]
    movie_details['summary'] = data.get('overview', '').replace("'", "\'")
    movie_details['poster'] = f"https://image.tmdb.org/t/p/w500{data.get('poster_path', '')}"
    movie_details['scenesnap'] = f"https://image.tmdb.org/t/p/original{data.get('images', {}).get('backdrops', [{}])[0].get('file_path', '')}"

    return movie_details

def get_director(data):
    crew = data.get('credits', {}).get('crew', [])
    for member in crew:
        if member.get('job') == 'Director':
            return member.get('name', '').replace("'", "\'")
    return ''

# Generate the JavaScript module
js_module = generate_imdb_top_250_module()

# Write the module to a file
with open('imdb_top_250.js', 'w', encoding='utf-8') as file:
    file.write(js_module)

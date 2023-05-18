import requests
import json


# Function to fetch IMDb top 250 movies from TMDb API
def fetch_top_250_movies(api_key):
    url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={api_key}&language=en-US&page=1"
    response = requests.get(url)
    data = response.json()
    return data["results"]


# Function to fetch movie credits from TMDb API
def fetch_movie_credits(api_key, movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={api_key}"
    response = requests.get(url)
    data = response.json()
    return data


# Function to generate JavaScript module with movie data
def generate_javascript_module(movies):
    module_template = "const movies = [{}];\n\nexport default movies;"

    movie_objects = []
    for movie in movies:
        movie_id = movie["id"]
        movie_credits = fetch_movie_credits(api_key, movie_id)

        title = movie["title"].replace("'", "\\'")
        director = ""
        for crew in movie_credits["crew"]:
            if crew["job"] == "Director":
                director = crew["name"].replace("'", "\\'")
                break
        description = movie["overview"].replace("'", "\\'")
        rating = movie["vote_average"]
        poster = f"https://image.tmdb.org/t/p/original{movie['poster_path']}"

        movie_object = f"\n  {{\n    title: '{title}',\n    director: '{director}',\n    description: '{description}',\n    rating: {rating},\n    poster: '{poster}'\n  }}"
        movie_objects.append(movie_object)

    module_content = module_template.format(",".join(movie_objects))
    return module_content


# Main code
api_key = "my_api_key"
movies = fetch_top_250_movies(api_key)
javascript_module = generate_javascript_module(movies)

# Save the JavaScript module to a file
with open("imdb_top_250_movies.js", "w", encoding="utf-8") as file:
    file.write(javascript_module)

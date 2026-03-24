from flask import Flask, render_template, request
import os
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Constants for TMDB API
API_KEY = os.environ["TMDB_API_KEY"]
BASE_URL = "https://api.themoviedb.org/3"


def make_api_request(endpoint, params):
    """Helper function to make a request to TMDB API."""
    url = f"{BASE_URL}/{endpoint}"
    params["api_key"] = API_KEY
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Based Route fetches trending movies for the homepage
@app.route("/")
def base_route():
    params = {"language": "en-US"}
    trending_data = make_api_request("trending/movie/week", params)

    trending_movies = []
    # Get top 10 trending movies
    if trending_data:
        trending_movies = trending_data.get("results", [])[:10]

    return render_template("base.html", trending_movies=trending_movies)


@app.route("/movies")
def movies():
    category = request.args.get("category")
    if category:
        params = {"language": "en-US", "page": 1}
        movies_data = make_api_request(f"movie/{category}", params)
        if movies_data:
            return render_template(
                "movies.html", movies=movies_data.get("results", []), category=category
            )
        else:
            return "Failed to retrieve data from TMDB API", 500
    return "No category provided", 400


@app.route("/search_movie", methods=["GET"])
def search_movie():
    movie_name = request.args.get("movie_name")
    if movie_name:
        params = {"query": movie_name, "language": "en-US", "page": 1}
        search_results = make_api_request("search/movie", params)
        if search_results:
            return render_template(
                "movie.html", search_results=search_results.get("results", [])
            )
        else:
            return "Failed to retrieve data from TMDB API", 500
    else:
        return "No movie name provided", 400


@app.route("/movie/<int:movie_id>")
def movie_detail(movie_id):
    # Now fetching credits, recommendations, AND videos (trailers)
    params = {
        "language": "en-US",
        "append_to_response": "credits,recommendations,videos",
    }
    movie_data = make_api_request(f"movie/{movie_id}", params)

    if movie_data:
        # Find the YouTube trailer key from the videos list
        # We look for a 'Trailer' on 'YouTube'
        trailer_key = None
        if "videos" in movie_data:
            for video in movie_data["videos"]["results"]:
                if video["type"] == "Trailer" and video["site"] == "YouTube":
                    trailer_key = video["key"]
                    break

        return render_template(
            "movie_detail.html", movie=movie_data, trailer_key=trailer_key
        )
    return "Movie details not found", 404


@app.route("/watchlist")
def watchlist():
    return render_template("watchlist.html")

@app.route('/watched')
def watched_list():
    return render_template('watched.html')


if __name__ == "__main__":
    app.run(debug=True, port=5001)

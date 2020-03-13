from flask import Flask
from .crawler import *

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


@app.route('/api/article/<int:article_id>')
def article_info(article_id):
    return get_article(article_id)


@app.route('/api/article/<int:article_id>/content')
def article_content(article_id):
    return get_article(article_id, True)


@app.route('/api/article_list/<int:page>')
def article_ids(page):
    return get_article_ids(page)


@app.route('/api/article_list/')
def latest_page_article_ids():
    return get_article_ids("")


if __name__ == '__main__':
    app.run()

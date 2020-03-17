from flask import Flask, send_from_directory
import crawler as cra

app = Flask(__name__, static_folder='website-new', static_url_path='')
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def give_html():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def give_js(path):
    return send_from_directory('website-new', path)


@app.route('/api/article/<article_id>')
def article_info(article_id):
    return cra.get_article(article_id)


@app.route('/api/article/<article_id>/content')
def article_content(article_id):
    return cra.get_article(article_id, True)


@app.route('/api/article_list/<int:page>')
def article_ids(page):
    return cra.get_article_ids(page)


@app.route('/api/article_list/')
def latest_page_article_ids():
    return cra.get_article_ids()


if __name__ == '__main__':
    app.run(port=8080)

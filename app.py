from flask import Flask
import crawler as cra

app = Flask(__name__, static_folder='website-new', static_url_path='')
app.config['JSON_AS_ASCII'] = False


@app.route('/', methods=["GET"])
def give_html():
    return app.send_static_file('index.html')


@app.route('/api/article/<article_id>', methods=["GET"])
def article_info(article_id):
    return cra.get_article(article_id)


@app.route('/api/article/<article_id>/content', methods=["GET"])
def article_content(article_id):
    return cra.get_article(article_id, True)


@app.route('/api/article_list/<int:page>', methods=["GET"])
def article_ids(page):
    return cra.get_article_ids(page)


@app.route('/api/article_list/', methods=["GET"])
def latest_page_article_ids():
    return cra.get_article_ids()


if __name__ == '__main__':
    app.run(port=8080)

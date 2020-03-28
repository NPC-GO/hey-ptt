from flask import Flask, request
import crawler as cra

app = Flask(__name__, static_folder='website-new', static_url_path='')
app.config['JSON_AS_ASCII'] = False


@app.route('/', methods=['GET'])
def give_html():
    return app.send_static_file('index.html')


@app.route('/api/articles/<article_id>/info', methods=['GET'])
def article_info(article_id):
    return cra.get_article(article_id, is_include_content=False)


@app.route('/api/articles/<article_id>', methods=['GET'])
def article_content(article_id):
    return cra.get_article(article_id, is_include_content=True)


@app.route('/api/articles', methods=['GET'])
def article_ids():
    page = request.args.get('page')
    return cra.get_article_ids(page)


if __name__ == '__main__':
    app.run()

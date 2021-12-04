from flask import Flask, request
import crawler as cra
from renderer import render

app = Flask(__name__, static_folder='website', static_url_path='')
app.config['JSON_AS_ASCII'] = False


@app.route('/', methods=['GET'])
def give_html():
    return app.send_static_file('index.html')


@app.route('/api/articles/<article_id>/info', methods=['GET'])
def article_info(article_id):
    board = request.args.get('board')
    return cra.get_article(article_id, board, is_include_content=False)


@app.route('/api/articles/<article_id>', methods=['GET'])
def article_content(article_id):
    board = request.args.get('board')
    raw_data = cra.get_article(article_id, board, is_include_content=True)
    return render(raw_data)


@app.route('/api/articles', methods=['GET'])
def article_ids():
    page = request.args.get('page')
    board = request.args.get('board')
    return cra.get_article_ids(board, page)


@app.route('/api/boards', methods=['GET'])
def get_boards():
    return cra.get_popular_boards()

if __name__ == '__main__':
    app.run()

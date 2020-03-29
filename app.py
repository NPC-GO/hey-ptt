from flask import Flask, request
import crawler as cra
import re

app = Flask(__name__, static_folder='website-new', static_url_path='')
app.config['JSON_AS_ASCII'] = False


def render_img_content(data: dict) -> dict:
    content = data["content"]

    img_links = re.findall(r"(?:http:|https:)?//.*\.(?:png|jpg)", content)
    for img_link in img_links:
        pos = content.find(img_link)
        new = "<img alt src='{}'>".format(img_link)
        content = content[:pos] + new + content[pos + len(img_link):]
    content = "<br />".join(content.split("\n"))
    data["content"] = content
    return data


def render_https_content(data: dict) -> dict:
    data["content"].replace("http", "https")
    return data


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
    return render_https_content(render_img_content(raw_data))


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

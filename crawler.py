import requests
from bs4 import BeautifulSoup


# 取出頁數或是 id
def get_last_session_of_url(url) -> str:
    url_split = url.split('/')
    page_or_id = url_split[3]
    page_or_id = page_or_id.replace('index', '')
    page_or_id = page_or_id.replace('.html', '')
    return page_or_id


def get_article(id_, board="Gossiping", is_include_content=False) -> dict:
    base_url = "https://www.ptt.cc/bbs/"
    if board is None:
        board = "Gossiping"
    url = base_url + board + "/" + id_ + '.html'

    # 以 GET 傳請求給目標伺服器，伺服器回傳 response 物件
    # response 接收回傳值
    cookies = dict({"over18": "1"})

    response = requests.get(url, cookies=cookies)
    if response.status_code / 100 != 2:
        return dict(author='', title='本文已被刪除', time='', content='', error=response.status_code)

    # 以 html.parser 為解析器解析 response.text 中的內容 存入 soup 中
    # response.text 為網頁原始碼
    soup = BeautifulSoup(response.text, 'html.parser')

    # 搜尋第一個標籤為 div , id 為 main-container 的目標 存入 content
    content = soup.find('div', id='main-container')
    # 抓取作者 標題 時間 的資訊
    information = content.find_all('span', class_='article-meta-value')
    if len(information) < 4:
        return dict(error='advanced content', author='', title='', time='', content='')
    author = information[0].text
    title = information[2].text
    time = information[3].text

    # 以 dict 存取
    articles = dict(author=author, title=title, time=time)

    # 如果 is_include_content 為 True 及為需要取得內容
    if is_include_content is True:
        articles.update(dict(content='<br>'.join(str(content).split("\n"))))

    return articles


def get_article_ids(board="Gossiping", page="") -> dict:
    base_url = "https://www.ptt.cc/bbs/"
    if page is None:
        page = ""

    if board is None:
        board = "Gossiping"

    # format 中的內容會替換 {} 所在的位置
    url = base_url + board + '/index{}.html'.format(page)
    cookies = dict(over18="1")

    response = requests.get(url, cookies=cookies)
    if response.status_code / 100 != 2:
        return dict(articles='', prev='', error=response.status_code)

    if response.status_code == 200:
        # 搜尋所有標籤為 div 且 class 為 r-ent 的目標
        # class_ 是因為避免和保留字 class 衝突
        soup = BeautifulSoup(response.text, 'html.parser')
        content = soup.find_all('div', class_='r-ent')
        url = soup.find_all('a', class_='btn wide')
        prev_page = get_last_session_of_url(url[1].get('href'))

        # 新建 articles 的型別為 list
        id_list = list()
        data = dict(prev=prev_page)
        # i 依序為在 content 中的項目
        for i in content:
            # 如果沒有找到標籤 a 表示文章被刪除 繼續往下一個目標尋找
            if i.find('a') is None:
                continue

            # 找尋第一個標籤為 a 把 href 的值存入 content_url
            content_url = i.find('a').get('href')

            # 取出 article_id
            article_id = get_last_session_of_url(content_url)

            # 存入基本資料
            id_list.append(article_id)
        data.update(dict(articles=id_list))

        return data
    soup = BeautifulSoup(response.text, 'html.parser')
    error = soup.find('title')
    error_message = dict(error=error.get_text())
    return error_message


def get_popular_boards() -> dict:
    url = "https://www.ptt.cc/bbs/index.html"
    response = requests.get(url)
    if not response or response.status_code != 200:
        return dict(boards=["Gossiping"])
    soup = BeautifulSoup(response.text, 'html.parser')
    board_names = [div.get_text() for div in soup.find_all("div", class_="board-name")]
    return dict(boards=board_names)

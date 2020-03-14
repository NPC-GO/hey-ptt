import requests
from bs4 import BeautifulSoup

# 取出頁數或是 id
def get_last_session_of_url(url):
    url_split = url.split('/')
    page_or_id = url_split[3]
    page_or_id = page_or_id.replace('index' , '')
    page_or_id = page_or_id.replace('.html' , '')

    return page_or_id

def get_article(id_ , is_include_content = False):
    url = 'https://www.ptt.cc/bbs/joke/' + id_ +'.html'

    # 以 GET 傳請求給目標伺服器，伺服器回傳 response 物件
    # response 接收回傳值
    response = requests.get(url)

    # 以 html.parser 為解析器解析 response.text 中的內容 存入 soup 中
    # response.text 為網頁原始碼
    soup = BeautifulSoup(response.text , 'html.parser')

    # 搜尋第一個標籤為 div , id 為 main-container 的目標 存入 content
    content = soup.find('div' , id='main-container')
    # 抓取作者 標題 時間 的資訊
    information = content.find_all('span' , class_='article-meta-value')
    author = information[0].text
    title = information[2].text
    time = information[3].text

    # 以 dict 存取
    articles = {'author' : author , 'title' : title , 'time' : time}

    # 如果 is_include_content 為 True 及為需要取得內容
    if (is_include_content == True):
        div = content.find_all('div')

        # 刪除不需要的資訊
        for i in range(len(div) - 1):
            div[i + 1].clear()
        articles.update({'content' : div[0].get_text()})

    return articles
    
def get_article_ids(page=""):
    if (page == None):
        page = ''
    # format 控制 {}
    url = 'https://www.ptt.cc/bbs/joke/index{}.html'.format(page)
    response = requests.get(url)

    if (response == 200):
        # 搜尋所有標籤為 div 且 class 為 r-ent 的目標
        # class_ 是因為避免和保留字 class 衝突
        soup = BeautifulSoup(response.text , 'html.parser')
        content = soup.find_all('div' , class_='r-ent')
        url = soup.find_all('a' , class_='btn wide')
        prev_page = get_last_session_of_url(url[1].get('href'))
        
        # 新建 articles 的型別為 list
        data = {}
        id_list = []
        data = {'prev' : prev_page}

        # i 依序為在 content 中的項目
        for i in content:
            # 如果沒有找到標籤 a 表示文章被刪除 繼續往下一個目標尋找
            if (i.find('a') == None):
                continue

            # 找尋第一個標籤為 a 把 href 的值存入 content_url
            content_url = i.find('a').get('href')

            # 取出 id
            id = get_last_session_of_url(content_url)

            # 存入基本資料
            id_list.append(id)
        data.update({'articles' : id_list})
        
        return data
    else:
        soup = BeautifulSoup(response.text , 'html.parser')
        error = soup.find('title')
        error_message = {'error' , error.get_text()}
        
        return error_message

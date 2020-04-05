import re
# from bs4 import BeautifulSoup as b


def render(data: dict) -> dict:
    # r = render_img_content(data)
    r = render_https_content(data)
    return r


# (?:http:|https:)?\/\/(?:imgur.com).(.......)
# def render_img_content(data: dict) -> dict:
#     content = data["content"]
#     soup = b(content, 'html.parser')
#     blockquote = soup.find_all('blockquote')
#     for x in blockquote:
#         print(x.get("data-id"))
#     data["content"] = content
#     return data


def render_https_content(data: dict) -> dict:
    data["content"].replace("http", "https")
    return data

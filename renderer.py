import re


def render(data: dict) -> dict:
    r = render_img_content(data)
    r = render_https_content(r)
    return r


def render_img_content(data: dict) -> dict:
    content = data["content"]
    # imgur_links = re.findall(r"(?:http:|https:)?//.*\.(?:png|jpg|gif)", content)
    img_links = re.findall(r"(?:http:|https:)?//.*\.(?:png|jpg|gif)", content)
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

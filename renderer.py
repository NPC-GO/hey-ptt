from bs4 import BeautifulSoup as Bs


def render(data: dict) -> dict:
    r = email_protected(data)
    r = render_https_content(r)
    return r


def email_protected(data: dict) -> dict:
    if "__cf_email__" in data["content"]:
        content = data["content"]
        soup = Bs(content, 'html.parser')
        protected_emails = soup.find_all("a", class_="__cf_email__")
        for protected_email in protected_emails:
            protected_email.name = "span"
            protected_email.string = ""
        data["content"] = str(soup)
    return data


def render_https_content(data: dict) -> dict:
    data["content"].replace("http", "https")
    return data

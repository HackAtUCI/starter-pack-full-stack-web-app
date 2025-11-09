from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

def webscrape(search):
    links =[]
    search_url = "https://www.change.org/search?q="+search
    #print(search_url)
    driver = webdriver.Chrome()
    driver.get(search_url)
    request_result = driver.page_source
    html = BeautifulSoup(request_result, "html.parser")
    for link in html.find_all('a'):
        if link.get('href').startswith("/p/"):
            links.append(link.get('href'))

    json_body = []    

    for key, url in enumerate(links[:3]):
        driver = webdriver.Chrome()
        full_url = "https://www.change.org"+url
        driver.get(full_url)
        petition= driver.page_source
        petition_html = BeautifulSoup(petition,"html.parser")
        title = petition_html.find("h1", class_ =["petition-title","corgi-8pem40"]).text
        img = "https:"+ petition_html.find('img',class_="corgi-ife7d0").get('src')
        
        json_body.append({"title": title, "image": img, "url": full_url})
    return json_body





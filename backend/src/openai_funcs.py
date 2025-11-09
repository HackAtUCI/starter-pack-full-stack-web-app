from openai import OpenAI
import os
import json


def initialize_connection():
    key=os.environ['OPENAI_API_KEY']
    return OpenAI(api_key=key)

def get_ranks(client: OpenAI, user_input: str, num_of_articles: int):
    response= client.responses.create(
        model="gpt-5-mini",
        input=user_input,
        tools=[{"type": "web_search"}],
        instructions=f"browse for the top {num_of_articles} (or if less than {num_of_articles} articles, rank the given ones) most relevant free news articles to the user's given query. With each entry, each entry is marked by only a single `, and has items that are separated by a single ` as well and the items follow in the exact order of: title and link. No extra information or text.",
        store=True
    )
    return response.output_text

def parse_gpt_output(chat_input: str, num_of_articles: int):
    output_dict = dict()
    articles_list = chat_input.split('`')
    articles_list.pop(0)
    for n in range(0, num_of_articles):
        output_dict[n] = articles_list[0].strip(), articles_list[1].strip()
        articles_list.pop(0)
        articles_list.pop(0)
    return json.dumps(output_dict)

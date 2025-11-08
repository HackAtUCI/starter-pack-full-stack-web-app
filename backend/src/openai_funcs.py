from openai import OpenAI
import os


def initialize_connection():
    key=os.environ['OPENAI_API_KEY']
    key = (key[1: len(key)-1])
    return OpenAI(api_key=key)

def do_something(client: OpenAI):
    response = client.responses.create(
    model="gpt-5-nano",
    input="write a haiku about ai",
    store=True,
)
    print(response.output_text)

def get_ranks(client: OpenAI, user_input: str):
    response= client.responses.create(
        model="gpt-5-nano",
        input=user_input,
        instructions="From the given unordered list/database of items, give the top 5 (or if less than 5 articles, rank the given ones) most relevant items to the user's given query. Give only rankings, no extra fluff.",
        store=True
    )
    return response.output_text

"""
What's up with the environment?

1. Woodchucks Vs. Moles 2, releases the 30th of November!
2. Gibberish Co. builds a zero waste factory near a lake
3. Super Evil Foundation dumps coal into water treatment facility
"""


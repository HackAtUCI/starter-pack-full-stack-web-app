from openai import OpenAI
import os


def initialize_connection():
    key=os.environ['OPENAI_API_KEY']
    return OpenAI(api_key=key)

def get_ranks(client: OpenAI, user_input: str):
    response= client.responses.create(
        model="gpt-5-mini",
        input=user_input,
        tools=[{"type": "web_search"}],
        instructions="browse for the top 5 (or if less than 5 articles, rank the given ones) most relevant free news articles to the user's given query. With each entry, each entry has items that should follow in the exact order of: title, link, and direct image address. No extra fluff.",
        store=True
    )
    return response.output_text

"""
What's up with the environment?

1. Woodchucks Vs. Moles 2, releases the 30th of November!
2. Gibberish Co. builds a zero waste factory near a lake
3. Super Evil Foundation dumps coal into water treatment facility
"""


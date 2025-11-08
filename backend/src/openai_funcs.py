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

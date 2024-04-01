from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

system_message = """
As a text generation assistant, your role is to analyze and elucidate the specifications provided by the user
regarding their computer setup. We'll delve into the advantages and disadvantages of the components chosen.
Let's begin by dissecting the configuration."""


def textGeneration(system_message, json_data_string):
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": system_message},
        {"role": "user", "content": json_data_string}
    ])

    return completion


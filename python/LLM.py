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


# JSON data string provided by the user
json_data_string = """
Best Individual:
CPU: 
  Name: CPU1
  Base Clock: 3.5 GHz
  Cores: 4
  Multi-threaded: No
  Socket: Socket1
  Wattage: 100W
  Price: $200
Casing: 
  Name: Casing2
  Form Factor: Mini-ITX
  RGB: No
  Price: $60
GPU: 
  Name: GPU2
  Core Clock: 1200 MHz
  VRAM: 8GB
  Price: $500
Motherboard: 
  Name: Motherboard1
  Form Factor: ATX
  Max Memory: 16GB
  Socket: Socket1
  Price: $150
PSU: 
  Name: PSU1
  Wattage: 500W
  Price: $80
RAM: 
  Name: RAM1
  Capacity: 8GB
  RGB: Yes
  Price: $100

Total Price: $1090
Fitness: -0.989010989010989
"""


def textGeneration(system_message, json_data_string):
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": system_message},
        {"role": "user", "content": json_data_string}
    ])

    return completion


from openai import OpenAI
from dotenv import load_dotenv
from transformers import pipeline
import os
import torch

load_dotenv()

def get_device():
    if torch.torch.cuda.is_available():
        return torch.device('cuda:0')
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device('mps')
    else:
        return torch.device('cpu')

model = pipeline(
    task='zero-shot-classification',
    model='MoritzLaurer/mDeBERTa-v3-base-mnli-xnli',
    device=get_device()
)

model = pipeline(
    task='zero-shot-classification',
    model='MoritzLaurer/mDeBERTa-v3-base-mnli-xnli',
    device=get_device()
)

labels = ["politics", "economy", "entertainment", "environment", "greeting", "computer spec",
          "sports", "technology", "science", "education", "health", "food",
          "travel", "history", "art", "music", "literature", "business",
          "finance", "culture", "language", "religion", "philosophy",
          "psychology", "society", "fashion", "lifestyle", "automobile",
          "aviation", "space", "nature", "wildlife", "climate", "energy",
          "architecture", "design", "film", "television", "gaming",
          "social media", "internet", "cybersecurity", "software",
          "hardware", "data science", "programming", "engineering",
          "medicine", "fitness", "cooking", "cuisine", "restaurants",
          "tourism", "geography", "anthropology", "sociology",
          "fine arts", "performing arts", "photography", "crafts",
          "DIY", "parenting", "relationships", "self-improvement",
          "motivation", "inspiration", "success", "failure",
          "mindfulness", "meditation", "yoga", "wellness",
          "alternative medicine", "gardening", "pets",
          "celebrities", "fame", "pop culture", "memes",
          "celebrations", "holidays", "festivals",
          "traditions", "mythology", "folklore", "legends",
          "superstitions", "urban legends", "conspiracy theories",
          "paranormal", "cryptozoology", "extraterrestrial life",
          "aliens", "UFOs", "ghosts", "hauntings", "cryptozoological creatures"]

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
classifier = pipeline("text-classification", model="nlptown/bert-base-multilingual-uncased-sentiment")

system_message = """
I'm here to help you with short questions about your computer setup. My job is to provide straightforward answers using simple language. Let's get started by looking into your configuration.
"""

def textGeneration(system_message, message, result_string):
    output = model(message, labels, multi_label=False)
    print(output["labels"])
    if output["labels"][0] != "computer spec":
        message = "This question is not about the computer. or fix your sentence by add keyword ex. computer or spec"
        return message
    
    message += result_string
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": system_message},
        {"role": "user", "content": message}
    ])
    
    print(completion)

    return completion


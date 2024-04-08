from transformers import pipeline
import torch

# Function to get the appropriate device (CPU or GPU)
def get_device():
    # CUDA GPU
    if torch.torch.cuda.is_available():
        return torch.device('cuda:0')
    # Mac GPU
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device('mps')
    # CPU
    else:
        return torch.device('cpu')

model = pipeline(
    task='zero-shot-classification',
    model='MoritzLaurer/mDeBERTa-v3-base-mnli-xnli',
    device=get_device()
)

text = "Do you think this computer spec can play overwatch?"

labels = ["politics", "economy", "entertainment", "environment", "computer", "greeting",
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

# Classify the text into one of these labels.
output = model(text, labels, multi_label=False)

print(f'Input : {text}')
print(f'Output: {output}')
print(f'Most probable class is: {output["labels"][0]} with probability {output["scores"][0]}.')
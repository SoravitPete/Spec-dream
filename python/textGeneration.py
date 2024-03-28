from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

checkpoint = "google/pegasus-xsum"
prompt = (
    "The total price is $1300 which meets or is within the budget of $1300. with score 10. "
    "The components are compatible with each other. with score 10. "
    "The system meets the performance criteria. with score 7.0. "
    "The chosen style matches the desired style (Gamer). with score 10. "
)

tokenizer = AutoTokenizer.from_pretrained(checkpoint)
inputs = tokenizer(prompt, return_tensors="pt")

model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint)

try:
    outputs = model.generate(**inputs, num_beams=5, num_beam_groups=5, max_new_tokens=30, diversity_penalty=1.0)
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("Generated Summary:", generated_text)
except Exception as e:
    print("Error occurred:", str(e))

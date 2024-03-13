from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder

# Sample hardware dataset (replace with your actual dataset)
hardware_data = [
    {'name': 'CPU1', 'price': 300, 'performance': 90, 'brand': 'Intel', 'category': 'CPU'},
    {'name': 'CPU2', 'price': 250, 'performance': 80, 'brand': 'AMD', 'category': 'CPU'},
    {'name': 'GPU1', 'price': 500, 'performance': 95, 'brand': 'NVIDIA', 'category': 'GPU'},
    {'name': 'GPU2', 'price': 450, 'performance': 85, 'brand': 'AMD', 'category': 'GPU'},
    {'name': 'RAM8GB', 'price': 80, 'performance': 70, 'brand': 'Corsair', 'category': 'RAM'},
    {'name': 'RAM16GB', 'price': 120, 'performance': 85, 'brand': 'Kingston', 'category': 'RAM'},
    {'name': 'Storage256GB', 'price': 100, 'performance': 75, 'brand': 'Samsung', 'category': 'Storage'},
    {'name': 'Storage512GB', 'price': 180, 'performance': 90, 'brand': 'Western Digital', 'category': 'Storage'},
    # Add more hardware items
]

# Extract all unique brands and categories from the dataset
all_brands = set(item['brand'] for item in hardware_data)
all_categories = set(item['category'] for item in hardware_data)

# Convert categorical labels to numerical labels using LabelEncoder
brand_encoder = LabelEncoder()
brand_encoder.fit(list(all_brands))

category_encoder = LabelEncoder()
category_encoder.fit(list(all_categories))

# Features and labels for the machine learning model
X = [[item['price'], item['performance'], brand_encoder.transform([item['brand']])[0], category_encoder.transform([item['category']])[0]] for item in hardware_data]
y = [item['name'] for item in hardware_data]

# Train a decision tree model
model = DecisionTreeClassifier()
model.fit(X, y)

def recommend_hardware_ml(user_behavior):
    # Example user behavior (replace with actual user behavior data)
    user_preferences = {
        'CPU': 'Intel', 
        'GPU': 'NVIDIA', 
        'RAM': '16GB', 
        'Storage': '512GB'
    }

    # Ensure that the encoder is fitted with all possible labels
    user_preferences['CPU'] = brand_encoder.transform([user_preferences['CPU']])[0]
    user_preferences['GPU'] = brand_encoder.transform([user_preferences['GPU']])[0]
    user_preferences['RAM'] = category_encoder.transform([user_preferences['RAM']])[0]
    user_preferences['Storage'] = category_encoder.transform([user_preferences['Storage']])[0]

    # Predict the hardware items based on user preferences
    recommended_items = model.predict([[
        user_preferences['price'], 
        user_preferences['performance'], 
        user_preferences['CPU'], 
        user_preferences['GPU'], 
        user_preferences['RAM'], 
        user_preferences['Storage']
    ]])

    return f"Recommended hardware components: {', '.join(recommended_items)}"

# Test the machine learning recommendation logic
user_behavior_data = {
    'CPU': 'Intel', 
    'GPU': 'NVIDIA', 
    'RAM': '16GB', 
    'Storage': '512GB'
}
recommendation_result_ml = recommend_hardware_ml(user_behavior_data)
print(recommendation_result_ml)

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import accuracy_score, classification_report

# Sample data with App_Usage_Time for individual programs
data = {
    'User_ID': [1, 2, 3],
    'Usage_Patterns': ['Heavy', 'Moderate', 'Light'],
    'Task_Frequency': ['Regular', 'Occasional', 'Frequent'],
    'Multitasking_Habits': ['High', 'Medium', 'Low'],
    'CPU': ['Intel i7', 'AMD Ryzen 5', 'Intel i5'],
    'GPU': ['Nvidia GTX 3080', 'AMD Radeon RX 570', 'Integrated'],
    'RAM': ['32GB', '16GB', '8GB'],
    'Storage': ['1TB SSD', '500GB HDD', '256GB SSD'],
    'OS': ['Windows 10', 'Ubuntu', 'macOS'],
    'Software': [['Program1', 'Program2'], ['Program2', 'Program3'], ['Program3', 'Program4']],
    'App_Usage_Time': [['3 days', '7 days'], ['2 days', '5 days'], ['4 days', '6 days']],
    'Resource_Consumption': ['High', 'Medium', 'Low'],
    'Upgrade_History': ['2022-01-01', '2022-02-15', '2021-12-05'],
    'Performance_Rating': [5, 4, 3],
    'Performance_Issues': ['No', 'Yes', 'Yes'],
    'Preferences': ['Optimal', 'Balanced', 'Power Saving'],
    'Age': [28, 35, 22],
    'Profession': ['Graphic Designer', 'Software Developer', 'Student'],
    'Open_Tabs': [20, 10, 5],
    'Program_Usage': ['Program1', 'Program2', 'Program3'],
}

# Convert 'App_Usage_Time' to numerical features
def convert_app_usage_time(app_usage_time):
    converted_time = [int(time.split()[0]) for time in app_usage_time]
    return converted_time

data['App_Usage_Time'] = [convert_app_usage_time(usage_time) for usage_time in data['App_Usage_Time']]

# Flatten the 'Software' list of lists
mlb = MultiLabelBinarizer()
software_encoded = mlb.fit_transform(data['Software'])
software_df = pd.DataFrame(software_encoded, columns=mlb.classes_)

# Flatten the 'App_Usage_Time' list of lists
app_usage_time_df = pd.DataFrame(data['App_Usage_Time'], columns=[f'App_Usage_Time_{i}' for i in range(len(data['App_Usage_Time'][0]))])

# Combine the original data with the encoded 'Software' and 'App_Usage_Time' features
data = pd.concat([pd.DataFrame(data), software_df, app_usage_time_df], axis=1)

# Drop non-numeric columns and columns used for encoding
X = data.drop(['User_ID', 'Usage_Patterns', 'Task_Frequency', 'Multitasking_Habits',
               'CPU', 'GPU', 'RAM', 'Storage', 'OS', 'Software', 'Resource_Consumption',
               'Upgrade_History', 'Performance_Issues', 'Preferences', 'Profession',
               'Program_Usage', 'App_Usage_Time', 'Performance_Rating'], axis=1)

# Target variable
y = data['Performance_Rating']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Decision Tree Classifier
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy}")

# Display the classification report
class_report = classification_report(y_test, y_pred)
print("Classification Report:")
print(class_report)

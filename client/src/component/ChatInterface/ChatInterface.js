import React, { useState } from 'react';
import './ChatInterface.css'; // Import your CSS file for styling

function ChatInterface() {
    const [messages, setMessages] = useState([]);

    function sendMessage(messageText) {
        if (messageText.trim() !== '') {
            setMessages([...messages, { text: messageText, sender: 'user' }]);
            textGeneration(messageText);
        }
    }

    function textGeneration(messageText) {
        const data = {
            message: messageText
        };
    
        fetch('http://127.0.0.1:5000/textGeneration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
            const aiResponse = { text: '', sender: 'ai' };
            setMessages(prevMessages => [...prevMessages, aiResponse]);
            
            let i = 0;
            const typingInterval = setInterval(() => {
                aiResponse.text += result.charAt(i);
                setMessages(prevMessages => [...prevMessages]); 
                
                i++;
                if (i === result.length) {
                    clearInterval(typingInterval); 
                }
            }, 50); 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const messageText = event.target.value;
            sendMessage(messageText);
            event.target.value = '';
        }
    }

    return (
        <div className="chat-interface">
            <div className="chat-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                />
            </div>
        </div>
    );
}

export default ChatInterface;

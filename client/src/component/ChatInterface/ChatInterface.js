import React, { useState } from 'react';
import './ChatInterface.css'; // Import your CSS file for styling

function ChatInterface() {
    const [messages, setMessages] = useState([]);

    function sendMessage(messageText) {
        if (messageText.trim() !== '') {
            setMessages([...messages, { text: messageText, sender: 'user' }]);
            setTimeout(() => {
                const response = { text: 'This is a response from AI.', sender: 'ai' };
                setMessages([...messages, response]);
            }, 500);
        }
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
import React, { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        // Update chat history with the user's message
        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        setTimeout(() => {
            setChatHistory((history) => [...history, { role: "model", text: "edene sanya..." }]);

            generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
        }, 600);
    
    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Message..."
                className="message-input"
                required
            />
            <button type="submit" className="material-symbols-outlined">
                arrow_upward
            </button>
        </form>
    );
};

export default ChatForm;

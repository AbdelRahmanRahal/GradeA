import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./components/CourseCard";
import Loading from "../../components/Loading.jsx";
import { useLoading } from '../../context/LoadingContext';
import ViewAllButton from "./components/ViewAllButton.jsx";
import ChatbotIcon from "../../components/chatbotIcon.jsx";
import '../../Styles/Chatbot.css';
import ChatForm from "../../components/ChatForm.jsx";
import ChatMessage from "../../components/ChatMessage.jsx";

const Dashboard = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [showChatbot, setShowChatbot] = useState(false);
    const chatBodyRef = useRef();

    const generateBotResponse = async (history) => {
        // helper function to update chat history 
        const updateHistory = (text, isError = false) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "edene sanya..."), {role: "model", text, isError}]);
        }

        // format chat history for API request
        history = history.map(({role, text}) => ({role, parts: [{text}]}));

        const requestOption = {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ contents: history })
        };
    

        try {
            // Make the API call to get the bot's response
            const response = await fetch(import.meta.env.VITE_API_URL, requestOption);
            const data = await response.json();
            if(!response.ok) throw new Error(data.error.message || "Something went wrong!");

            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);
        } catch(error) {
            updateHistory(error.message, true);
        }

    }

    const [data, setData] = useState([]); // temp
    const { setLoading } = useLoading();


    const handleChatbotToggle = () => {
        setShowChatbot((prevState) => !prevState); // This toggles the state between true and false
    };

    useEffect(() => {
        // auto scroll whenever chat history updates
        chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
    }, [chatHistory]);

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setLoading(true);
        fetch('/api/courses')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching courses:', error));
        setLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 relative"> {/* Set relative positioning here */}
            <main className="p-6">
                <div className="bg-white shadow-md rounded p-4">
                    <h3 className="text-xl font-bold mb-4">Your Courses</h3>
                    {data.length > 0 ? (
                        <div className={`inline-flex gap-6 max-w-full`}>
                            <div className="flex overflow-x-auto gap-6">
                                {data.slice(0, 3).map((item) => (
                                    <CourseCard
                                        key={item.id}
                                        title={item.name}
                                        description={item.description}
                                        image="https://via.placeholder.com/300"
                                    />
                                ))}
                            </div>
                            <ViewAllButton redirectLink={"/"} />
                        </div>
                    ) : (
                        <p>No courses found.</p>
                    )}
                </div>
            </main>
            
            <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
                <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
                    <span className="material-symbols-outlined">mode_comment</span>
                    <span className="material-symbols-outlined">close</span>
                </button>
                <div className="chatbot-popup">
                    {/*chatbot header*/}
                    <div className="chat-header">
                        <div className="header-info">
                            <ChatbotIcon /> 
                            <h2 className="logo-text">Chatbot</h2>
                        </div>
                        <button onClick={() => setShowChatbot(prev => !prev)}
                        className="material-symbols-outlined">keyboard_arrow_down</button>
                    </div>

                    {/*chatbot body*/}
                    <div ref={chatBodyRef} className="chat-body">
                        <div className="message bot-message">
                            <ChatbotIcon />
                            <p className="message-text">
                               What’s up? 😎 <br /> How can I assist you today?
                            </p>
                        </div>

                        {/* Render the chat history dynamically */}
                        {chatHistory.map((chat, index) => (
                            <ChatMessage key={index} chat={chat} />
                        ))}
                        
                    </div>

                    {/*chatbot Footer*/}
                    <div className="chat-footer">
                        <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

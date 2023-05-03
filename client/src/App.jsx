import { useState, useEffect } from "react";
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

function App() {
  // input given by user will be updated by these states
    const [input, setInput] = useState("");
    // object  has two property =>type:user/bot
    // =>post:text by user/bot
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        document.querySelector(".layout").scrollTop =
            document.querySelector(".layout").scrollHeight;
    }, [posts]);

    const fetchBotResponse = async () => {
        const { data } = await axios.post(
        
            "https://chatgpt-ai-envj.onrender.com",
            { input },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return data;
    };

    const autoTypingBotResponse = (text) => {
        let index = 0;
        let interval = setInterval(() => {
            if (index < text.length) {
                setPosts((prevState) => {
                    let lastItem = prevState.pop();
                    if (lastItem.type !== "bot") {
                        prevState.push({
                            type: "bot",
                            post: text.charAt(index - 1),
                        });
                    } else {
                        prevState.push({
                            type: "bot",
                            post: lastItem.post + text.charAt(index - 1),
                        });
                    }
                    return [...prevState];
                });
                index++;
            } else {
                clearInterval(interval);
            }
        }, 30);
    };

    const onSubmit = () => {
      // submit method will return if input bar is empty
        if (input.trim() === "") return;
        //will get the input of the user
        updatePosts(input);
        updatePosts("loading...", false, true);
        setInput("");
        fetchBotResponse().then((res) => {
            console.log(res.bot.trim());
            updatePosts(res.bot.trim(), true);
        });
    };

    const updatePosts = (post, isBot, isLoading) => {
        if (isBot) {
            autoTypingBotResponse(post);
        } else {
          // previous post the user and bot will retain
            setPosts((prevState) => {
                return [
                    ...prevState,
                    {
                        type: isLoading ? "loading" : "user",
                        post,
                    },
                ];
            });
        }
    };

    const onKeyUp = (e) => {
      // if you click enter key onsubmit method will be called
        if (e.key === "Enter" || e.which === 13) {
            onSubmit();
        }
    };

    return (
        <main className="chatGPT-app">
            <section className="chat-container">
                <div className="layout">
                  {/* loop is created so that user can enter number of questions */}
                    {posts.map((post, index) => (
                        <div
                        // to run loop key is imp
                            key={index}
                            className={`chat-bubble ${
                              // if post type is bot ||loading then text will be of bot else it will be empty
                                post.type === "bot" || post.type === "loading"
                                    ? "bot"
                                    : ""
                            }`}
                        >
                          {/* this image is conditionally  */}
                            <div className="avatar">
                                <img
                                    src={
                                      // if type is bot||loading show bot otherwise user
                                        post.type === "bot" ||
                                        post.type === "loading"
                                            ? bot
                                            : user
                                    }
                                />
                            </div>
                            {post.type === "loading" ? (
                                <div 
                                // for loading icon if post type==loading 
                                className="loader">
                                    <img src={loadingIcon} />
                                </div>
                            ) : (
                              // text of user and bot will appear here
                                <div className="post">{post.post}</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            {/* contains the footer section of the website which is chatbar */}
            <footer>
                <input
                    className="composebar"
                    value={input}
                    // default value of autofocus is true
                    autoFocus
                    type="text"
                    placeholder="Ask anything!"
                    // event will get the value typed by user
                    onChange={(e) => setInput(e.target.value)}

                    onKeyUp={onKeyUp}
                />
                {/* when you click on button onSubmit function will be trigerred */}
                <div className="send-button" onClick={onSubmit}>
                    <img src={send} />
                </div>
            </footer>
        </main>
    );
}

export default App;
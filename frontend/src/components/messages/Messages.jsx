import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";

const Messages = () => {
    const {messages : initialMessages,loading} = useGetMessages();
    const { messages, setMessages } = useConversation();
    useListenMessages();
    const lastMessageRef = useRef();
    console.log("messages:", messages);


     // Sync initial messages from useGetMessages to store
        useEffect(() => {
            if (!loading && initialMessages.length > 0) {
            setMessages(initialMessages);
            }
        }, [initialMessages, loading, setMessages]);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({behavior: "smooth"});
        },100)
    }, [messages]);


	return (
		<div className='px-4 flex-1 overflow-auto'>
            {!loading && 
            messages.length > 0 &&
            messages.map((message) => (
                <div key={message._id}
                ref = {lastMessageRef}>
                    <Message  message = {message}/>
                </div>
            ))}


			{loading && [...Array(3)].map((_,idx) => <MessageSkeleton key={idx}/>)}

            {!loading && messages.length === 0 && (
                <p className="text-center"> Send a Message to start the conversation</p>
            )}
		</div>
	);
};
export default Messages;
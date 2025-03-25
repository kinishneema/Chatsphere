import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { BsCameraVideo } from "react-icons/bs";
import { useAuthContext } from "../../context/AuthContext";
import vectorImg from "../../assets/vectorImg.jpg";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation,messages, setMessages } = useConversation();
  const { authUser } = useAuthContext();


  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  const startVideoCall = async () => {
    try {
      // Step 1: Get the Meet link
      const meetResponse = await fetch("http://localhost:5000/api/create-meeting", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedConversation._id }),
      });

      if (meetResponse.status === 401) {
        window.location.href = "http://localhost:5000/auth/google";
        return;
      }

      const { meetLink } = await meetResponse.json();
      console.log(meetLink);
     
      if (!meetLink) throw new Error("No meet link received");

      // Step 2: Open the link for the caller
      window.open(meetLink, "_blank");

      console.log(selectedConversation);
      console.log(authUser._id);

      // Step 3: Determine receiverId from conversation
      const receiverId = selectedConversation._id
      console.log(receiverId);


          // Check participants before accessing
    // if (!selectedConversation.participants) {
    //     throw new Error("Participants not found in selectedConversation");
    //   }
  

      if (!receiverId) throw new Error("Receiver ID not found");
      
      // Step 4: Send the link as a message using the existing route
      const messageResponse = await fetch(`http://localhost:5000/api/messages/send/${receiverId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Join my video call: ${meetLink}` }),
      });

      if (!messageResponse.ok) {
        throw new Error(`Failed to send message: ${messageResponse.status}`);
      }

      const newMessage = await messageResponse.json();
      console.log("Message sent:", newMessage);

      // Update sender's messages state immediately
      setMessages([...messages, newMessage]);

    } catch (error) {
      console.error("Error starting video call:", error);
      alert("Failed to start video call.");
    }
  };

  return (
    <div className='md:min-w-[450px] flex flex-col'>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className='flex flex-row bg-slate-500 px-4 py-2 mb-2 items-center justify-between'>
            <div className='flex items-center'>
              <span className='label-text'>To:</span>
              <span className='text-gray-900 font-bold ml-1'>{selectedConversation.fullName}</span>
              {/* <span className='ml-2'>
                <img src={vectorImg} alt='Vector' 
                     className='w-8 h-8 rounded-full hover:bg-blue-600 cursor-pointer'
                     onClick={startVideoCall}
                     title='Start Video Call' />
              </span> */}
            </div>
            <button
              onClick={startVideoCall}
              className=' hover:bg-gray-800 text-white p-2 rounded-full'
              title='Start Video Call'
            >
              <BsCameraVideo size={20} />
            </button>
          </div>
          <Messages/>
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
        <p className='text-3xl'>
          Welcome <span className='text-blue-500'>{authUser.fullName}</span>
        </p>
        <p className='text-2xl'>Select a Chat to Start Messaging</p>
        <TiMessages className='text-3xl md:text-6xl text-center' />
      </div>
    </div>
  );
};
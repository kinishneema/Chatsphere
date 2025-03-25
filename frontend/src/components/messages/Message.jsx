import { useAuthContext } from "../../context/AuthContext"
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";


const Message = ({message}) => {

    const {authUser} = useAuthContext();
    const {selectedConversation} = useConversation(); 
    const fromMe = message.senderId === authUser._id;
    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const formattedTime = extractTime(message.createdAt);
    const bubbleBgColor = fromMe ? 'bg-blue-500' : "";
    const shakeClass = message.shouldShake ? "shake" : "";
    


    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                    alt = 'Tailwind CSS Chat Bubble component'
                    src = {profilePic}/>
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}`}>
            <span className='break-all'>
          {message.message.split(" ").map((word, index) =>
            word.startsWith("https://") ? (
              <a
                key={index}
                href={word}
                target='_blank'
                rel='noopener noreferrer'
                className='underline hover:text-blue-300'
              >
                {word}
              </a>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
          
        </span>
        </div>
        <div className="chat-footer opacity-50 text-white text-xs flex gap-1 items-center">{formattedTime} </div>
        </div>
    )
}

export default Message
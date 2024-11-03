import { MoreVertical, SendIcon } from 'lucide-react';
import Joy from '../../assets/joy.jpg'
import PropTypes from 'prop-types';
export default function ChatSection({ className }) {
    const chats = Array.from({ length: 20 }, () => {
        return {
            id: Math.floor(Math.random() * 10),
            name: 'Chiken Wings',
            img: Joy,
            time: '2 minutes ago',
            message: 'Lorem Ipsum dolor sit amet, consectetur adipiscing el et ea rebum Lorem Ipsum dolor sit amet, consectetur adipiscing el et ea rebum Lorem Ipsum dolor sit amet, consectetur adipiscing el et ea rebum'
        }
    });
    return <div className={className}>
        {/* <div className='h-90 flex justify-center items-center font-medium'>
            Chat is Empty
        </div> */}
        <div className='h-90 overflow-auto space-y-5'>
            {chats.map((chat, id) => <div key={id}>
                <div className='w-11/12 m-auto'>
                    <div className={`flex gap-2 items-center ${!chat.id && 'flex-row-reverse' }`}>
                        <div className='w-14 aspect-square rounded-full overflow-hidden'>
                            <img src={chat.img} alt={chat.name} className='h-auto' />
                        </div>
                        <div>
                            <div className='font-serif text-sm'>{chat.name}</div>
                            <div className='text-xs font-extralight'>{chat.time}</div>
                        </div>
                    </div>
                    <div className={`text-sm break-all ${!chat.id && 'text-right' }`}>
                        {chat.message}
                    </div>
                </div>
            </div>
            )}
        </div>
        <div className='flex bg-black flex-grow justify-center items-center rounded-t-lg'>
            <MoreVertical className='me-2' />
            <input type="text" placeholder="Enter message...." className='w-4/5 outline-none bg-black font-light text-xs' />
            <span className='bg-slate-900 hover:bg-slate-800 h-full w-12 rounded-e-lg flex justify-center items-center cursor-pointer '>
                <SendIcon className='active:animate-ping' />
            </span>
        </div>
    </div>
}

ChatSection.propTypes = {
    className: PropTypes.string
}
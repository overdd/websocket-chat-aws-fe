import React from "react";
import { Client } from "./types";


const Sidebar = ({ nickname, clients, setTargetNickname }: { nickname: string, clients: Client[], setTargetNickname: (nickname: string) => void }) => {

    return (
        <div className="flex flex-col md:ml-2">
            <div className="flex justify-center mt-7 mb-7 md:justify-start">
                <img src={`https://robohash.org/${nickname}.png`} alt="" className="w-8  rounded-full mr-2" />
                <span className="invisible md:visible w-0 md:w-auto font-medium">Chats</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
                {clients.map((client) => (
                    <button onClick={() => setTargetNickname(client.nickname)}>
                        <div className="flex mb-3">
                            <img src={`https://robohash.org/${client.nickname}.png`} alt="" className="w-8 h-8 rounded-full mr-1 " />
                            <div>
                                <span className="invisible md:visible w-0 md:w-auto text-sm leading-8">{client.nickname}</span>
                            </div>
                        </div>
                    </button>
                ))}

            </div>
        </div>
    )
}

export default Sidebar;
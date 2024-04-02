import React, { useRef } from 'react';
import './App.css';
import Login from './Login';
import WebSocketConnector from './WebSocketConnector';
import { Client, Message } from './types';
import Conversation from './Conversation';
import Sidebar from './Sidebar';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

const webSocketConnector = new WebSocketConnector()
function App() {

  const [nickname, setNickname] = React.useState(localStorage.getItem("nickname") || "");
  const [clients, setClients] = React.useState<Client[]>([]);
  const [targetNicknameValue, setTargetNicknameValue] = React.useState(localStorage.getItem("lastTargetNickname") || "");
  const [messages, setMessages] = React.useState<Message[]>([])

  React.useEffect(() => {
    window.localStorage.setItem("nickname", nickname);
    window.localStorage.setItem("lastTargetNickname", targetNicknameValue);
  });

  const webSocketConnectorRef = useRef(webSocketConnector);

  if (nickname === "") {
    return <Login setNickname={(nickname) => {
      setNickname(nickname);
      if (targetNicknameValue === "") {
        setTargetNicknameValue(nickname);
      }
    }} />;
  }

  const ws = webSocketConnectorRef.current.getConnection(`wss://ie86io8gk6.execute-api.us-east-1.amazonaws.com/dev?nickname=${nickname}`)

  const loadMessages = (nickname: string) => {
    ws.send(JSON.stringify({
      action: "getMessages",
      targetNickname: nickname,
      limit: 1000
    }))
  }

  ws.onopen = () => {
    ws.send(JSON.stringify({
      action: "getClients"
    }));
    loadMessages(targetNicknameValue);
  };

  ws.onmessage = (e) => {
    const message = JSON.parse(e.data) as {
      type: string,
      value: unknown
    };


    if (message.type === "clients") {
      setClients((message.value as { clients: Client[] }).clients);
    }
    if (message.type === "messages") {
      const unmarshalled = (message.value as { messages: AttributeValue[] }).messages.map(m => unmarshall(m));
      setMessages(unmarshalled.reverse() as Message[]);
    }
    if (message.type === "message") {
      const receivedMessage = (message.value as { message: string, sender: string });

      if (receivedMessage.sender === targetNicknameValue) {
        setMessages([
          ...messages,
          {
            message: receivedMessage.message,
            sender: receivedMessage.sender,
          } as Message
        ])
      }
    }
  }

  const setTargetNickname = (nickname: string) => {
    setMessages([]);
    loadMessages(nickname);
    setTargetNicknameValue(nickname);
  }

  const sendMessage = (message: string) => {
    ws.send(JSON.stringify({ action: "sendMessages", message, recepientNickname: targetNicknameValue }))
    setMessages([
      ...messages,
      {
        message,
        sender: nickname,
        createdAt: new Date().getTime(),
        messageId: Symbol().toString(),
        nicknameToNickname: [nickname, targetNicknameValue].sort().join("#")
      }
    ])
  }

  return (
    <div className='flex'>
      <div className='flex-none w-16 md:w-40 border-r-2'>
        <Sidebar clients={clients} setTargetNickname={setTargetNickname} nickname={nickname}/>
      </div>
      <div className='flex-auto'>
        <Conversation nickname={nickname} targetNickname={targetNicknameValue} messages={messages} sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default App;

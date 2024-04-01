export type Action = '$connect' | '$disconnect' | 'getMessages' | 'sendMessages' | 'getClients';

export interface Client {
  connectionId: string
  nickname: string
}

export interface SendMessageBody {
  message: string
  recepientNickname: string
};

export interface GetMessagesBody {
  targetNickname: string
  limit: number
}

export type Message = {
  messageId?: string,
  createdAt: number,
  nicknameToNickname: string,
  message: string,
  sender: string,
}

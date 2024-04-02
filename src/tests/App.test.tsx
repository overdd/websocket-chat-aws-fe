
import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import App from '../App';

const webSocketMock = window.WebSocket as any;

jest.mock('./../WebSocketConnector', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        getConnection: jest.fn(() => ({
            send: jest.fn(),
            onopen: jest.fn(),
            onmessage: jest.fn(),
        })),
    })),
}));

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders Login component if nickname is empty', () => {
        render(<App />);
        const nicknameInput = screen.getByPlaceholderText('Nickname');
        expect(nicknameInput).toBeInTheDocument();
    });

    it('renders Conversation component if nickname is provided', async () => {
        localStorage.setItem('nickname', 'testUser');
        render(<App />);
        await waitFor(() => {
            const joinButton = screen.getByText('Join');
            expect(joinButton).toBeInTheDocument();
        });
    });

    it('sends "getClients" and "getMessages" messages on WebSocket connection open', async () => {
        localStorage.setItem('nickname', 'testUser');
        render(<App />);
        await waitFor(() => {
            expect(window.WebSocket).toHaveBeenCalledTimes(1);
        });
    });

    it('updates clients state on receiving "clients" message', async () => {
        localStorage.setItem('nickname', 'testUser');
        render(<App />);
        await waitFor(() => {
            webSocketMock.instances[0].onmessage({ data: JSON.stringify({ type: 'clients', value: { clients: [{ nickname: 'user1' }] } }) });
            const user1Element = screen.getByText('user1');
            expect(user1Element).toBeInTheDocument();
        });
    });

    it('updates messages state on receiving "messages" message', async () => {
        localStorage.setItem('nickname', 'testUser');
        render(<App />);
        await waitFor(() => {
            webSocketMock.instances[0].onmessage({
                data: JSON.stringify({ type: 'messages', value: { messages: [{ message: 'Hello', sender: 'user1' }] } }),
            });
            const helloMessage = screen.getByText('Hello');
            expect(helloMessage).toBeInTheDocument();
        });
    });

    it('updates messages state and sends message on sendMessage function call', async () => {
        localStorage.setItem('nickname', 'testUser');
        render(<App />);
        const input = screen.getByPlaceholderText('Write your message!');
        const sendButton = screen.getByText('Send');
        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.click(sendButton);
        await waitFor(() => {
            expect(webSocketMock.instances[0].send).toHaveBeenCalledWith(JSON.stringify({
                action: 'sendMessages',
                message: 'Test message',
                recepientNickname: 'testUser',
            }));
        });
    });
});

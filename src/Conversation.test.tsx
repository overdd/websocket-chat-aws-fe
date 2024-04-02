/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Conversation from "./Conversation";
import { Message } from "./types";

const mockMessages = [
    { sender: "user1", message: "Hello" },
    { sender: "user2", message: "Hi" },
    { sender: "user1", message: "How are you?" }
] as Message[];

describe("Conversation Component", () => {
    it("renders without crashing", () => {
        const { getByText } = render(
            <Conversation
                nickname="test"
                targetNickname="target"
                messages={mockMessages}
                sendMessage={() => { }}
            />
        );
        const targetNicknameText = getByText("target");
        expect(targetNicknameText).toBeInTheDocument();
    });

    it("renders messages correctly", () => {
        const { getByText } = render(
            <Conversation
                nickname="test"
                targetNickname="target"
                messages={mockMessages}
                sendMessage={() => { }}
            />
        );

        mockMessages.forEach(({ sender, message }) => {
            const senderName = getByText(sender);
            const messageContent = getByText(message);
            expect(senderName).toBeInTheDocument();
            expect(messageContent).toBeInTheDocument();
        });
    });

    it("calls sendMessage with the entered message when 'Send' button is clicked", () => {
        const sendMessageMock = jest.fn();
        const { getByPlaceholderText, getByText } = render(
            <Conversation
                nickname="test"
                targetNickname="target"
                messages={mockMessages}
                sendMessage={sendMessageMock}
            />
        );

        const input = getByPlaceholderText("Write your message!");
        const sendButton = getByText("Send");

        fireEvent.change(input, { target: { value: "New message" } });
        fireEvent.click(sendButton);

        expect(sendMessageMock).toHaveBeenCalledWith("New message");
    });

    it("calls sendMessage with the entered message when 'Enter' key is pressed", () => {
        const sendMessageMock = jest.fn();
        const { getByPlaceholderText } = render(
            <Conversation
                nickname="test"
                targetNickname="target"
                messages={mockMessages}
                sendMessage={sendMessageMock}
            />
        );

        const input = getByPlaceholderText("Write your message!");

        fireEvent.change(input, { target: { value: "Another message" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(sendMessageMock).toHaveBeenCalledWith("Another message");
    });
});

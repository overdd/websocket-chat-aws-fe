import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Conversation from "../Conversation";
import { Message } from "../types";

const mockMessages = [
    { sender: "test", message: "Hello" },
    { sender: "target", message: "Hi" },
    { sender: "user1", message: "How are you?" }
] as Message[];

describe("Conversation Component", () => {
    it("renders without crashing", () => {
        render(
                <Conversation
                    nickname="test"
                    targetNickname="target"
                    messages={mockMessages}
                    sendMessage={() => { }}
                />
        );
        const targetNicknameText = screen.getByText("Hello");
        expect(targetNicknameText).toBeInTheDocument();
    });

    it("renders messages correctly", () => {
        render(
            <Conversation
                nickname="test"
                targetNickname="target"
                messages={mockMessages}
                sendMessage={() => { }}
            />
        );

        mockMessages.forEach(({ sender, message }) => {
            const senderName = screen.getByText(sender);
            const messageContent = screen.getByText(message);
            expect(senderName).toBeInTheDocument();
            expect(messageContent).toBeInTheDocument();
        });
    });

    it("calls sendMessage with the entered message when 'Send' button is clicked", () => {
        const sendMessageMock = jest.fn();
        render(
            <Conversation
                nickname="test"
                targetNickname="target"
                messages={mockMessages}
                sendMessage={sendMessageMock}
            />
        );

        const input = screen.getByPlaceholderText("Write your message!");
        const sendButton = screen.getByText("Send");

        fireEvent.change(input, { target: { value: "New message" } });
        fireEvent.click(sendButton);

        expect(sendMessageMock).toHaveBeenCalledWith("New message");
    });

    it("calls sendMessage with the entered message when 'Enter' key is pressed", () => {
        const sendMessageMock = jest.fn();
        render(
            <Conversation
                nickname="test"
                targetNickname="target"
                messages={mockMessages}
                sendMessage={sendMessageMock}
            />
        );

        const input = screen.getByPlaceholderText("Write your message!");

        fireEvent.change(input, { target: { value: "Another message" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(sendMessageMock).toHaveBeenCalledWith("Another message");
    });
});

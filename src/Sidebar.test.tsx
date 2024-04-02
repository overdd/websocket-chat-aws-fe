/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { Client } from "./types";

const mockClients = [
    { nickname: "user1", connectionId: 'connid1' },
    { nickname: "user2", connectionId: 'connid2' },
    { nickname: "user3", connectionId: 'connid3' }
] as Client[];

describe("Sidebar Component", () => {
    it("renders without crashing", () => {
        const { getByText } = render(
            <Sidebar
                nickname="test"
                clients={mockClients}
                setTargetNickname={() => { }}
            />
        );
        const chatTitle = getByText("Chats");
        expect(chatTitle).toBeInTheDocument();
    });

    it("renders correct number of clients", () => {
        const { getAllByRole } = render(
            <Sidebar
                nickname="test"
                clients={mockClients}
                setTargetNickname={() => { }}
            />
        );
        const clientButtons = getAllByRole("button");
        expect(clientButtons).toHaveLength(mockClients.length);
    });

    it("calls setTargetNickname with correct nickname when a client is clicked", () => {
        const setTargetNicknameMock = jest.fn();
        const { getByText } = render(
            <Sidebar
                nickname="test"
                clients={mockClients}
                setTargetNickname={setTargetNicknameMock}
            />
        );

        fireEvent.click(getByText("user1")); // Click on the first client
        expect(setTargetNicknameMock).toHaveBeenCalledWith("user1");

        fireEvent.click(getByText("user3")); // Click on another client
        expect(setTargetNicknameMock).toHaveBeenCalledWith("user3");
    });
});

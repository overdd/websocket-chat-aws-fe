/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Login from "./Login";

describe("Login Component", () => {
    it("renders without crashing", () => {
        const setNicknameMock = jest.fn();
        render(<Login setNickname={setNicknameMock} />);
    });

    it("renders input field correctly", () => {
        const setNicknameMock = jest.fn();
        const { getByPlaceholderText } = render(<Login setNickname={setNicknameMock} />);
        const input = getByPlaceholderText("Nickname");
        expect(input).toBeInTheDocument();
    });

    it("renders error message if nickname is empty", () => {
        const setNicknameMock = jest.fn();
        const { getByText } = render(<Login setNickname={setNicknameMock} />);
        const button = getByText("Join");
        fireEvent.click(button);
        const errorMessage = getByText("Nickname cannot be empty");
        expect(errorMessage).toBeInTheDocument();
    });

    it("calls setNickname with the entered nickname when Join button is clicked", () => {
        const setNicknameMock = jest.fn();
        const { getByPlaceholderText, getByText } = render(<Login setNickname={setNicknameMock} />);
        const input = getByPlaceholderText("Nickname");
        const button = getByText("Join");
        fireEvent.change(input, { target: { value: "TestUser" } });
        fireEvent.click(button);
        expect(setNicknameMock).toHaveBeenCalledWith("TestUser");
    });

    it("does not call setNickname if nickname is empty when Join button is clicked", () => {
        const setNicknameMock = jest.fn();
        const { getByText } = render(<Login setNickname={setNicknameMock} />);
        const button = getByText("Join");
        fireEvent.click(button);
        expect(setNicknameMock).not.toHaveBeenCalled();
    });
});

import React from "react";

const Login = () => {
    return (
        <section className="flex justify-center items-center h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white rounded p-6 space-y-4">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">AWS websocket chat</h2>
                </div>
                <div>
                    <input className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" type="text" placeholder="Nickname" />
                </div>
                <div>
                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200">Join</button>
                </div>
            </div>
        </section>
    )
}

export default Login;
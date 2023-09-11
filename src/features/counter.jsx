import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const choose = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

const Counter = () => {
    const [count, setCount] = useState(0)
    const { theme, setTheme } = useContext(ThemeContext)

    return (
        <div className="flex h-screen">
            <div className="m-auto">
                <div className="text-6xl text-red-600">{count}</div>
                <button className="btn btn-primary" type="button" onClick={() => setCount((count) => count + 1)}>
                    count+
                </button>
                <select data-choose-theme>
                    <option value="">Default</option>
                    <option value="dark">Dark</option>
                    <option value="pink">Pink</option>
                </select>
            </div>
        </div>
    )
}
export default Counter;
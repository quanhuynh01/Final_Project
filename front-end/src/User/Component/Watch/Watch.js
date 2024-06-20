import React, { useState, useEffect } from "react";
import "./Watch.css";
const WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function Watch() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        function updateTime() {
            const now = new Date();

            setTime(
                zeroPadding(now.getHours(), 2) + ":" +
                zeroPadding(now.getMinutes(), 2) + ":" +
                zeroPadding(now.getSeconds(), 2)
            );

            setDate(
                now.getFullYear() + "-" +
                zeroPadding(now.getMonth() + 1, 2) + "-" +
                zeroPadding(now.getDate(), 2) + "-" +
                WEEK[now.getDay()]
            );
        }

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    function zeroPadding(num, digit) {
        return String(num).padStart(digit, '0');
    }

    return (
        <div className="clock">
            <p id="date">{date}</p>
            <p id="time">{time}</p>
        </div>
    );
}

export default Watch;

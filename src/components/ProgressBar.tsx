import React, { useState, useEffect } from "react";
import "./ProgressBar.css"; // Import your CSS file for styling

const ProgressBar = ({
    maxValue,
    duration
}: {
    maxValue: number;
    duration: number;
}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (progress < maxValue) {
                setProgress((prevProgress) =>
                    prevProgress < maxValue ? prevProgress + 1 : maxValue
                );
            } else {
                clearInterval(interval);
            }
        }, duration / maxValue);

        return () => clearInterval(interval);
    }, [progress, maxValue, duration]);

    const progressWidth = (progress / maxValue) * 100;
    const adjustedWidth = progressWidth > maxValue ? maxValue : progressWidth;

    return (
        <div className="flex justify-center">
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${adjustedWidth}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {toBoolean} from "@/utils/Utils.jsx";

const DevConsole = ({show}) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const logQueue = [];

        const scheduleLogUpdate = () => {
            if (logQueue.length > 0) {
                const logsToAdd = [...logQueue];
                logQueue.length = 0;
                setLogs((prevLogs) => [...prevLogs, ...logsToAdd]);
            }
        };

        const logMessage = (type, args) => {
            const message = args
                .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
                .join(' ');
            logQueue.push({ type, message });

            setTimeout(scheduleLogUpdate, 0);
        };

        console.log = (...args) => {
            logMessage('log', args);
            originalLog(...args);
        };

        console.warn = (...args) => {
            logMessage('warn', args);
            originalWarn(...args);
        };

        console.error = (...args) => {
            logMessage('error', args);
            originalError(...args);
        };

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    const clearLogs = () => setLogs([]);

    const consoleElement = (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                maxHeight: '34vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
                color: '#fff',
                zIndex: 9999,
                opacity: toBoolean(show) ? 1 : 0,
                fontSize: '12px',
                padding: '5px',
                pointerEvents: 'none', // Allows interaction with elements behind
                display: 'flex',
                flexDirection: 'column',
                top: toBoolean(show) ? undefined : '100vh'
            }}
        >
            <button
                style={{
                    backgroundColor: '#444',
                    color: '#fff',
                    border: 'none',
                    padding: '5px',
                    cursor: 'pointer',
                    pointerEvents: 'auto' // Keeps button clickable
                }}
                onClick={clearLogs}
            >
                Clear Console
            </button>
            <div
                style={{
                    flex: 1, // Takes available space
                    overflowY: 'auto', // Enables scrolling
                    pointerEvents: 'auto', // Allows user to scroll
                    padding: '5px'
                }}
            >
                {logs.map((log, index) => (
                    <div
                        key={index}
                        style={{
                            color: log.type === 'error' ? 'red' : log.type === 'warn' ? 'yellow' : 'white',
                        }}
                    >
                        [{log.type.toUpperCase()}] {log.message}
                    </div>
                ))}
            </div>
        </div>
    );

    return ReactDOM.createPortal(consoleElement, document.body);
};

export default DevConsole;
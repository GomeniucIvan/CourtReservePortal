import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const DevConsole = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const logQueue = [];

        // Helper to schedule updates without triggering render-phase warnings
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

            // Defer state updates
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

        // Cleanup
        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    const clearLogs = () => setLogs([]);

    const consoleElement = (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '200px',
            backgroundColor: '#000',
            color: '#fff',
            overflowY: 'scroll',
            zIndex: 9999,
            fontSize: '12px',
            padding: '5px'
        }}>
            <button
                style={{
                    backgroundColor: '#444',
                    color: '#fff',
                    border: 'none',
                    padding: '5px',
                    marginBottom: '5px',
                    cursor: 'pointer'
                }}
                onClick={clearLogs}
            >
                Clear Console
            </button>
            {logs.map((log, index) => (
                <div key={index} style={{ color: log.type === 'error' ? 'red' : log.type === 'warn' ? 'yellow' : 'white' }}>
                    [{log.type.toUpperCase()}] {log.message}
                </div>
            ))}
        </div>
    );

    return ReactDOM.createPortal(consoleElement, document.body);
};

export default DevConsole;
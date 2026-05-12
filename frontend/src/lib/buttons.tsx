import React from 'react';

interface RunButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
}

export function RunButton({ onClick, type = "button", children }: RunButtonProps) {
    return (
        <button className="run-btn" type={type} onClick={onClick}>
            {children}
        </button>
    );
}

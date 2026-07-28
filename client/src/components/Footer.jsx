import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full bg-surface-soft py-8 px-4 mt-auto border-t border-hairline">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="text-body font-medium">
                    <p>Project made by : Parth Singhal</p>
                    <p className="mt-1 text-sm text-muted">E-mail : parthsinghal725@gmail.com</p>
                </div>
                <div>
                    <a 
                        href="https://github.com/PLYRparth" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-active transition"
                    >
                        Github
                    </a>
                </div>
            </div>
        </footer>
    );
}

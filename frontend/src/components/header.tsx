import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

function Header() {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <header>
            <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="brand">
                    <div className="brand-dot"></div>
                    <div>
                        <div className="brand-name">CardioPredict</div>
                        <div className="brand-sub">heart disease prediction</div>
                    </div>
                </div>

                <div className="topbar-nav">
                    <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>Prediction</Link>
                    <Link to="/advanced-predict" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>Advanced</Link>
                    <Link to="/analytics" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>Analytics</Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        className="theme-toggle"
                        onClick={() => setDark(d => !d)}
                        aria-label="Toggle dark mode"
                        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {dark ? '☀️' : '🌙'}
                    </button>
                    <div className="api-status">
                        <div className="api-dot"></div>
                        FastAPI · /predict
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
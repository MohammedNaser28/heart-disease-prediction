import { Link } from 'react-router-dom';
import '../App.css';

function Header() {
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
                    <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>Prediction</Link>
                    <Link to="/advanced-predict" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>Advanced</Link>
                    <Link to="/analytics" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>Analytics</Link>
                </div>

                <div className="api-status">
                    <div className="api-dot"></div>
                    FastAPI · /predict
                </div>
            </div>
        </header>
    );
}

export default Header;
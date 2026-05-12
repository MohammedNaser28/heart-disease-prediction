import '../App.css';
import API_BASE_URL from '../config';

export function AnalyticsPage() {
    return (
        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Model Analytics</h2>

            <div className="model-strip" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">SVM Confusion Matrix</div>
                    <img
                        src={`${API_BASE_URL}/graphs/svm_cm.png`}
                        alt="SVM Confusion Matrix"
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}
                    />
                </div>

                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">Decision Tree Confusion Matrix</div>
                    <img
                        src={`${API_BASE_URL}/graphs/tree_cm.png`}
                        alt="Decision Tree Confusion Matrix"
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}
                    />
                </div>

                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">Logistic Regression Confusion Matrix</div>
                    <img
                        src={`${API_BASE_URL}/graphs/lr_cm.png`}
                        alt="Logistic Regression Confusion Matrix"
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}
                    />
                </div>
                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">KNN</div>
                    <img
                        src={`${API_BASE_URL}/graphs/knn_cm.png`}
                        alt="KNN "
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}
                    />
                </div>
                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">Gradient Boost</div>
                    <img
                        src={`${API_BASE_URL}/graphs/gb_cm.png`}
                        alt="Gradient Boost"
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}
                    />
                </div>
                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">Random Forest</div>
                    <img
                        src={`${API_BASE_URL}/graphs/random_cm.png`}
                        alt="Random Forest"
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }}
                    />
                </div>
            </div>
        </div>
    );
}

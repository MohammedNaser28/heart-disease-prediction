import '../App.css';

export function AnalyticsPage() {
    return (
        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Model Analytics</h2>
            
            <div className="model-strip" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">SVM Confusion Matrix</div>
                    <img 
                        src="http://localhost:8000/graphs/svm_cm.png" 
                        alt="SVM Confusion Matrix" 
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }} 
                    />
                </div>

                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">Decision Tree Confusion Matrix</div>
                    <img 
                        src="http://localhost:8000/graphs/tree_cm.png" 
                        alt="Decision Tree Confusion Matrix" 
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }} 
                    />
                </div>

                <div className="model-card" style={{ height: 'auto', padding: '20px' }}>
                    <div className="model-card-name">Logistic Regression Confusion Matrix</div>
                    <img 
                        src="http://localhost:8000/graphs/lr_cm.png" 
                        alt="Logistic Regression Confusion Matrix" 
                        style={{ width: '100%', maxWidth: '400px', marginTop: '15px' }} 
                    />
                </div>
            </div>
        </div>
    );
}

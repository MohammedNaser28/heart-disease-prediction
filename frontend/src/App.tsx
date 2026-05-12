import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "./components/header.tsx";
import { PredictPage } from "./pages/predict.tsx";
import { AnalyticsPage } from "./pages/analytics.tsx";
import { AdvancedPredictPage } from "./pages/advanced_predict.tsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<PredictPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/advanced-predict" element={<AdvancedPredictPage />} />
      </Routes>
    </>
  )
}

export default App;

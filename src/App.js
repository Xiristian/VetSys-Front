import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navbar from './components/Navbar';
import ProductPage from './components/ProductPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorPage from './components/TutorPage';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container-fluid mt-5 pt-3">
                <Routes>
                    <Route path="/" element={<div>/* Seu conteúdo principal aqui */</div>} />
                    <Route path="/produtos" element={<ProductPage />} />
                    <Route path="/tutor" element={<TutorPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;


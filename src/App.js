import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navbar from './components/Navbar';
import ProcedimentoPage from './components/ProcedimentoPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorPage from './components/TutorPage';
import SpeciesPage from './components/SpeciesPage';
import AnimalPage from './components/AnimalPage';
import AtendimentoPage from './components/AtendimentoPage';
import EmpregadoPage from './components/EmpregadoPage';
import MaterialPage from './components/MaterialPage';
import RemedioPage from './components/RemedioPage';
import InternacaoPage from './components/InternacaoPage';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container-fluid mt-5 pt-3">
                <Routes>
                    <Route path="/" element={<div>/* Seu conteúdo principal aqui */</div>} />
                    <Route path="/procedimento" element={<ProcedimentoPage />} />
                    <Route path="/internacao" element={<InternacaoPage />} />
                    <Route path="/material" element={<MaterialPage />} />
                    <Route path='/remedio' element={<RemedioPage />} />
                    <Route path="/tutor" element={<TutorPage />} />
                    <Route path="/empregado" element={<EmpregadoPage />} />
                    <Route path="/especie" element={<SpeciesPage />} />
                    <Route path='/animal' element={<AnimalPage />} />
                    <Route path='/atendimento' element={<AtendimentoPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">VetSys</NavLink>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" exact>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/procedimento">Procedimentos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/produtos">Produtos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/material">Materiais</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/remedio">Remédios</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/tutor">Tutores</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/empregado">Empregados</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/especie">Espécies</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/animal">Animais</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/atendimento">Atendimento</NavLink>
                        </li>
                        {/* Outros links aqui */}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
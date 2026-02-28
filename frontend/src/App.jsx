import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vehiculos, setVehiculos] = useState([]);
  // Estados 
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [vin, setVin] = useState('');
  const [estado, setEstado] = useState('');
  const [color, setColor] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const cargarDatos = () => {
    fetch('http://localhost:3001/api/vehiculos')
      .then(res => res.json())
      .then(data => setVehiculos(data))
      .catch(err => console.error("Error al cargar:", err));
  };

  useEffect(() => { cargarDatos(); }, []);

  const cancelarTodo = () => {
    setEditandoId(null);
    setMarca(''); setModelo(''); setAnio(''); setVin(''); setEstado(''); setColor('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vehiculoData = { marca, modelo, anio: parseInt(anio), vin, estado, color };

    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId
      ? `http://localhost:3001/api/vehiculos/${editandoId}`
      : 'http://localhost:3001/api/vehiculos';

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData)
      });

      const resData = await response.json();

      if (!response.ok) {
        alert(resData.message); //2 VIN
      } else {
        cargarDatos();
        cancelarTodo();
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  const iniciarEdicion = (v) => {
    setEditandoId(v.id);
    setMarca(v.marca); setModelo(v.modelo); setAnio(v.anio); setVin(v.vin); setEstado(v.estado); setColor(v.color || '');
    window.scrollTo(0, 0);
  };

  const marcasUnicas = [...new Set(vehiculos.map(v => v.marca))].length;

  return (
    <div className="shell">

      {/* NAV */}
      <nav className="nav">
        <div className="nav-left">
          <div className="nav-logo">
            <svg width="18" height="18" viewBox="0 0 64 32" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20 L10 8 L42 8 L54 20" />
              <path d="M2 20 L62 20 L62 26 L2 26 Z" />
              <path d="M14 8 L18 16 L46 16 L50 8" />
              <circle cx="14" cy="26" r="5" />
              <circle cx="50" cy="26" r="5" />
              <line x1="2" y1="20" x2="2" y2="26" />
              <line x1="62" y1="20" x2="62" y2="26" />
            </svg>
          </div>
          <span className="nav-brand">Control Vehicular</span>
          <div className="nav-sep" />
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Resumen de flota</div>
          <div className="kpi-grid">
            <div className="kpi">
              <div className="kpi-val g">{vehiculos.length}</div>
              <div className="kpi-lbl">Unidades</div>
            </div>
            <div className="kpi">
              <div className="kpi-val">{marcasUnicas}</div>
              <div className="kpi-lbl">Marcas</div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-head">
            <span className="form-head-label">
              {editandoId ? 'Editar registro' : 'Nuevo vehículo'}
            </span>
            {editandoId && <span className="edit-badge">Editando</span>}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <div className="form-body">
              <div className="field">
                <label className="field-lbl">Marca</label>
                <input className="field-inp" type="text" placeholder="Ej: Toyota" value={marca} onChange={e => setMarca(e.target.value)} required />
              </div>
              <div className="field">
                <label className="field-lbl">Modelo</label>
                <input className="field-inp" type="text" placeholder="Ej: Hilux" value={modelo} onChange={e => setModelo(e.target.value)} required />
              </div>
              <div className="field">
                <label className="field-lbl">Año</label>
                <input className="field-inp" type="number" placeholder="Ej: 2024" value={anio} onChange={e => setAnio(e.target.value)} required />
              </div>
              <div className="field">
                <label className="field-lbl">VIN / Chasis</label>
                <input className="field-inp" type="text" placeholder="Código único" value={vin} onChange={e => setVin(e.target.value)} required disabled={!!editandoId} />
              </div>
              <div className="field">
                <label className="field-lbl">Estado</label>
                <input className="field-inp" type="text" placeholder="Ej: Aduana, En Transito..." value={estado} onChange={e => setEstado(e.target.value)} required />
              </div>
              <div className="field">
                <label className="field-lbl">Color</label>
                <input className="field-inp" type="text" placeholder="Ej: Rojo, Azul..." value={color} onChange={e => setColor(e.target.value)} required />
              </div>
            </div>

            <div className="btn-row">
              <button type="submit" className={`btn-save ${editandoId ? 'is-edit' : ''}`}>
                {editandoId ? '↑ Actualizar datos' : '+ Guardar vehículo'}
              </button>
              {editandoId && (
                <button type="button" className="btn-cancel" onClick={cancelarTodo}>
                  ✕ Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="main-header">
          <span className="main-title">Inventario de flota</span>
          <span className="count-chip">{vehiculos.length} registros</span>
        </div>

        <div className="table-wrap">
          {vehiculos.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🚘</div>
              <div className="empty-txt">— Sin registros en el inventario —</div>
            </div>
          ) : (
            // TABLA (PDS-12)
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Color</th>
                  <th>VIN</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map(v => (
                  <tr key={v.id}>
                    <td className="cell-id">#{v.id}</td>
                    <td className="cell-marca">{v.marca}</td>
                    <td>{v.modelo}</td>
                    <td>{v.anio}</td>
                    <td>{v.color || ''}</td>
                    <td className="cell-vin">{v.vin}</td>
                    <td><span className="status-tag">{v.estado}</span></td>
                    <td>
                      <div className="actions">
                        <button className="btn-e" onClick={() => iniciarEdicion(v)}>Editar</button>
                        <button className="btn-d" onClick={() => {
                          if (confirm("¿Eliminar?"))
                            fetch(`http://localhost:3001/api/vehiculos/${v.id}`, { method: 'DELETE' })
                              .then(() => cargarDatos())
                        }}>Borrar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

    </div>
  );
}

export default App;
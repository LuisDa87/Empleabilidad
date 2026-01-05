import { FormEvent, useEffect, useMemo, useState } from 'react';

type Vacancy = {
  id: string;
  title: string;
  description: string;
  technologies: string;
  seniority: string;
  location: string;
  modality: string;
  salaryRange: string;
  company: string;
  maxApplicants: number;
  isActive: boolean;
};

type User = { id: string; name: string; email: string; role: string };

function Icon({ name, size = 18 }: { name: 'user' | 'briefcase' | 'power' | 'check' | 'bolt' | 'lock' | 'plus'; size?: number }) {
  const stroke = '#cbd5e1';
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  // dejo iconos inline para no meter otra librería solo por esto
  switch (name) {
    case 'user':
      return (
        <svg {...common}>
          <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...common}>
          <path d="M4 7h16v11H4z" />
          <path d="M9 7V5h6v2" />
          <path d="M4 12h16" />
        </svg>
      );
    case 'power':
      return (
        <svg {...common}>
          <path d="M12 2v10" />
          <path d="M6.1 4.2a9 9 0 1 0 11.8 0" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
  }
}

export default function Home() {
  const [apiKey, setApiKey] = useState('super-api-key');
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

  const [email, setEmail] = useState('coder@riwi.com');
  const [password, setPassword] = useState('coder123');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [lastApplied, setLastApplied] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [newVacancy, setNewVacancy] = useState({
    title: 'Backend Node.js',
    description: 'API REST con NestJS y PostgreSQL',
    technologies: 'Node.js, NestJS, PostgreSQL',
    seniority: 'Mid',
    softSkills: 'Comunicación, trabajo en equipo',
    location: 'Medellín',
    modality: 'remoto',
    salaryRange: '6M - 8M COP',
    company: 'Riwi Partner',
    maxApplicants: 3,
  });

  const isAuthenticated = !!token;
  const isManager = user?.role === 'admin' || user?.role === 'gestor';

  const headers = useMemo(
    () => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [apiKey, token]
  );

  useEffect(() => {
    if (token) fetchVacancies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login falló');
      setUser(data.user);
      setToken(data.accessToken);
      setMessage(`Hola ${data.user.name}, rol ${data.user.role}`);
    } catch (err: any) {
      setMessage(err.message || 'Error en login');
    } finally {
      setLoading(false);
    }
  }

  async function fetchVacancies() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${baseUrl}/api/vacancies`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error listando vacantes');
      setVacancies(data);
      setMessage(`Vacantes cargadas: ${data.length}`);
    } catch (err: any) {
      setMessage(err.message || 'Error listando vacantes');
    } finally {
      setLoading(false);
    }
  }

  async function applyToVacancy(id: string) {
    if (!isAuthenticated) return setMessage('Inicia sesión primero');
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${baseUrl}/api/applications`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ vacancyId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al postularse');
      setMessage('Postulación enviada');
      setLastApplied(new Date().toLocaleString());
    } catch (err: any) {
      setMessage(err.message || 'Error al postularse');
    } finally {
      setLoading(false);
    }
  }

  async function createVacancy(e: FormEvent) {
    e.preventDefault();
    if (!isManager) return setMessage('Solo admin/gestor');
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${baseUrl}/api/vacancies`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...newVacancy, maxApplicants: Number(newVacancy.maxApplicants) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear vacante');
      setMessage(`Vacante creada: ${data.title}`);
      setVacancies((prev) => [data, ...prev]);
    } catch (err: any) {
      setMessage(err.message || 'Error al crear vacante');
    } finally {
      setLoading(false);
    }
  }

  const activeVacancies = vacancies.filter((v) => v.isActive).length;

  if (!isAuthenticated) {
    return (
      <main className="page page-auth">
        <div className="auth-card">
          <div>
            <p className="eyebrow">Empleabilidad · Acceso</p>
            <h1>Conecta con las vacantes Riwi</h1>
            <p className="muted">
              Autentícate para explorar vacantes, postularte y administrar cupos. Usa tu API Key para firmar las peticiones.
            </p>
            <div className="quick-pill">
              <Icon name="lock" /> API URL: {baseUrl}
            </div>
            <div className="quick-pill">
              <Icon name="bolt" /> x-api-key: {apiKey}
            </div>
          </div>
          <div className="card glass">
            <h3>Iniciar sesión</h3>
            <form onSubmit={handleLogin} className="stack">
              <label>
                Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? '...' : 'Ingresar'}
              </button>
              <p className="muted">Seed: coder@riwi.com / coder123 · gestor@riwi.com / gestor123</p>
            </form>
            <div className="stack">
              <label>
                API URL
                <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
              </label>
              <label>
                x-api-key
                <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </label>
            </div>
          </div>
        </div>
        {message && <div className="toast">{message}</div>}
      </main>
    );
  }

  return (
    <main className="page shell">
      <aside className="sidebar">
        <div className="profile card">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p className="eyebrow">Sesión activa</p>
            <h3>{user?.name}</h3>
            <p className="muted">{user?.email}</p>
            <span className={`role ${user?.role}`}>{user?.role}</span>
          </div>
        </div>
        <div className="card">
          <h4>Acciones rápidas</h4>
          <div className="stack">
            <button onClick={fetchVacancies} disabled={loading}>
              <Icon name="briefcase" /> {loading ? 'Cargando...' : 'Refrescar vacantes'}
            </button>
            <button onClick={() => window.open(`${baseUrl}/docs`, '_blank')}>
              <Icon name="bolt" /> Abrir Swagger
            </button>
          </div>
        </div>
        <div className="card">
          <h4>Config</h4>
          <label>
            API URL
            <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
          </label>
          <label>
            x-api-key
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </label>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel · Vacantes</p>
            <h1>Hola, {user?.name}</h1>
            <p className="muted">Explora oportunidades y gestiona postulaciones desde un solo lugar.</p>
          </div>
          <div className="chips">
            <span className="chip">
              <Icon name="check" /> Activas: {activeVacancies}
            </span>
            <span className="chip">
              <Icon name="briefcase" /> Total: {vacancies.length}
            </span>
            <span className="chip">
              <Icon name="user" /> Rol: {user?.role}
            </span>
          </div>
        </header>

        <div className="grid main-grid">
          <div className="card glass">
            <div className="card-head">
              <h3>Vacantes disponibles</h3>
              <button className="ghost" onClick={fetchVacancies} disabled={loading}>
                <Icon name="power" /> {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
            <div className="list">
              {vacancies.map((v) => (
                <article key={v.id} className="vacancy">
                  <div className="v-header">
                    <div>
                      <h4>{v.title}</h4>
                      <p className="muted">
                        {v.company} · {v.location} · {v.modality} · Cupo: {v.maxApplicants}
                      </p>
                    </div>
                    {v.isActive ? <span className="badge ok">Activa</span> : <span className="badge warn">Inactiva</span>}
                  </div>
                  <p>{v.description}</p>
                  <p className="muted">Tech: {v.technologies}</p>
                  <p className="muted">Seniority: {v.seniority} · Salario: {v.salaryRange}</p>
                  <div className="actions">
                    <button onClick={() => applyToVacancy(v.id)} disabled={loading || !isAuthenticated}>
                      Postularme
                    </button>
                  </div>
                </article>
              ))}
              {vacancies.length === 0 && <p className="muted">Aún no hay vacantes cargadas.</p>}
            </div>
          </div>

          <div className="card glass">
            <div className="card-head">
              <h3>Crear vacante</h3>
              <span className="chip muted-chip">Solo admin/gestor</span>
            </div>
            <form onSubmit={createVacancy} className="stack">
              {Object.entries(newVacancy).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <input
                    value={value as string | number}
                    onChange={(e) =>
                      setNewVacancy((prev) => ({
                        ...prev,
                        [key]: key === 'maxApplicants' ? Number(e.target.value) : e.target.value,
                      }))
                    }
                  />
                </label>
              ))}
              <button type="submit" disabled={loading || !isManager}>
                <Icon name="plus" /> {loading ? '...' : 'Crear vacante'}
              </button>
              {!isManager && <p className="muted">Inicia sesión como admin o gestor para crear vacantes.</p>}
            </form>
          </div>

          <div className="card glass timeline">
            <div className="card-head">
              <h3>Actividad</h3>
            </div>
            <ul>
              <li>
                <Icon name="check" /> Último login: {new Date().toLocaleString()}
              </li>
              <li>
                <Icon name="briefcase" /> Vacantes listadas: {vacancies.length}
              </li>
              <li>
                <Icon name="power" /> Última postulación: {lastApplied || 'Aún no aplicas'}
              </li>
            </ul>
          </div>
        </div>
      </section>
      {message && <div className="toast">{message}</div>}
    </main>
  );
}

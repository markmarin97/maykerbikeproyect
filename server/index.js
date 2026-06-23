import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const formatDate = (date) => date.toISOString();
const addDays = (days) => formatDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));

async function ensureDbFile() {
  try {
    await fs.access(DB_FILE);
  } catch {
    const defaultState = {
      usuarios: [
        {
          id: 'admin-001',
          nombre: 'Administrador',
          correo: 'admin@maykerbike.com',
          contrasena: 'mayker2026',
          rol: 'admin',
          fecha_registro: formatDate(new Date()),
        },
      ],
      sorteos: [
        {
          id: 'sorteo-001',
          nombre_producto: 'Casco Racing Pro X1',
          descripcion: 'Casco de alto rendimiento con certificación ECE 22.06, ventilación avanzada, visera anti-arañazos y sistema de liberación de emergencia. Ideal para circuito y calle.',
          imagen: '/images/raffle-helmet.jpg',
          precio_ticket: 10,
          cantidad_tickets: 100,
          fecha_sorteo: addDays(30),
          estado: 'activo',
          fecha_creacion: formatDate(new Date()),
        },
        {
          id: 'sorteo-002',
          nombre_producto: 'Chaqueta Moto Leather Sport',
          descripcion: 'Chaqueta de cuero genuino con protecciones CE nivel 2 en hombros, codos y espalda. Forro térmico removible, costuras reforzadas y estilo deportivo premium.',
          imagen: '/images/raffle-jacket.jpg',
          precio_ticket: 15,
          cantidad_tickets: 200,
          fecha_sorteo: addDays(45),
          estado: 'activo',
          fecha_creacion: formatDate(new Date()),
        },
        {
          id: 'sorteo-003',
          nombre_producto: 'Guantes Moto Carbon Pro',
          descripcion: 'Guantes de motociclismo con nudilleras de carbono, palma reforzada anti-abrasión, compatible con pantallas táctiles y cierre ajustable. Máxima protección y confort.',
          imagen: '/images/raffle-gloves.jpg',
          precio_ticket: 5,
          cantidad_tickets: 150,
          fecha_sorteo: addDays(15),
          estado: 'activo',
          fecha_creacion: formatDate(new Date()),
        },
      ],
      compras: [],
      tickets: [],
      configuracion: {
        id: '1',
        numero_yape: '999-888-777',
        titular_yape: 'MaykerBike Oficial',
      },
      currentUser: null,
    };

    await fs.writeFile(DB_FILE, JSON.stringify(defaultState, null, 2), 'utf-8');
  }
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (!req.url) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Missing request URL.' }));
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/state' && req.method === 'GET') {
    try {
      const raw = await fs.readFile(DB_FILE, 'utf-8');
      res.writeHead(200);
      res.end(raw);
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Unable to read state file.' }));
    }
    return;
  }

  if (pathname === '/api/state' && req.method === 'PUT') {
    try {
      const body = await readRequestBody(req);
      const state = JSON.parse(body);
      await fs.writeFile(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Unable to save state file.' }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found.' }));
});

const port = process.env.PORT || 4000;
ensureDbFile()
  .then(() => {
    server.listen(port, () => {
      console.log(`MaykerBike backend API available at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize backend:', error);
    process.exit(1);
  });

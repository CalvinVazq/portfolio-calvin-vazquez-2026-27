import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import nodemailer from 'nodemailer';

const port = Number(process.env.PORT || 3001);
const dist = resolve('dist');
const attempts = new Map();
const services = ['IDENTITÉ VISUELLE', 'SITE WEB', 'UI/UX DESIGN', 'PHOTO / VIDÉO', 'DÉVELOPPEMENT SUR MESURE', 'AUTRE'];
const budgets = ['Moins de 500 CHF', "500 à 1'000 CHF", "1'000 à 2'500 CHF", "2'500 à 5'000 CHF", "Plus de 5'000 CHF", 'À définir ensemble'];
const sendJson = (res, status, body) => { res.writeHead(status, {'Content-Type':'application/json', 'Cache-Control':'no-store'}); res.end(JSON.stringify(body)); };
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

http.createServer(async (req, res) => {
  if (req.url === '/api/contact' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    for (const [key, timestamps] of attempts) if (!timestamps.some(t => t > now - 600000)) attempts.delete(key);
    const timestamps = (attempts.get(ip) || []).filter(t => t > now - 600000);
    if (timestamps.length >= 5) return sendJson(res, 429, {error:'Trop de tentatives.'});
    timestamps.push(now); attempts.set(ip, timestamps);
    if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return sendJson(res, 415, {error:'Format invalide.'});
    let raw = '';
    try {
      for await (const chunk of req) { raw += chunk; if (raw.length > 16000) return sendJson(res, 413, {error:'Message trop volumineux.'}); }
      const data = JSON.parse(raw);
      if (data.website) return sendJson(res, 200, {ok:true});
      const name = clean(data.name, 120), email = clean(data.email, 254), phone = clean(data.phone, 40), budget = clean(data.budget, 40), project = clean(data.project, 5000);
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email) || !Array.isArray(data.services) || !data.services.length || data.services.length > services.length || !data.services.every(s => services.includes(s)) || (budget && !budgets.includes(budget))) return sendJson(res, 400, {error:'Veuillez vérifier les champs.'});
      const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM} = process.env;
      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) { console.error('Configuration SMTP manquante.'); return sendJson(res, 503, {error:'Envoi indisponible.'}); }
      const smtpPort = Number(SMTP_PORT || 587);
      const transport = nodemailer.createTransport({host:SMTP_HOST, port:smtpPort, secure:smtpPort === 465, requireTLS:smtpPort !== 465, auth:{user:SMTP_USER, pass:SMTP_PASS}});
      await transport.sendMail({from:SMTP_FROM, to:'contact@calvinvazquez.ch', replyTo:email, subject:'Nouvelle demande de projet — portfolio', text:`Nom : ${name}\nE-mail : ${email}\nTéléphone : ${phone || 'Non renseigné'}\nBudget : ${budget || 'Non renseigné'}\nPrestations : ${data.services.join(', ')}\n\nProjet :\n${project || 'Non renseigné'}`});
      return sendJson(res, 200, {ok:true});
    } catch (error) { console.error('Erreur de traitement du contact:', error.message); return sendJson(res, 500, {error:'Envoi impossible.'}); }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, {error:'Méthode non autorisée.'});
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(dist, `.${pathname === '/' || /^\/projets\/[^/]+\/?$/.test(pathname) ? '/index.html' : pathname}`);
    if (file !== dist && !file.startsWith(dist + sep)) return sendJson(res, 403, {error:'Accès refusé.'});
    const contents = await readFile(file);
    const type = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'}[extname(file)] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type':type, 'X-Content-Type-Options':'nosniff'}); res.end(req.method === 'HEAD' ? undefined : contents);
  } catch { sendJson(res, 404, {error:'Introuvable.'}); }
}).listen(port, '0.0.0.0', () => console.log(`Serveur actif sur le port ${port}`));

import app from '../server.js';

export default function handler(req, res) {
  if (req.query && req.query.__path) {
    const rawPath = Array.isArray(req.query.__path) ? req.query.__path.join('/') : req.query.__path;
    req.url = '/api/' + rawPath;
  } else if (req.url === '/api/index.js' || req.url === '/api' || req.url === '/api/') {
    const matched = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'] || req.headers['x-rewrite-url'];
    if (matched) {
      req.url = matched;
    }
  }
  return app(req, res);
}

import app from '../server.js';

export default function handler(req, res) {
  if (req.query && req.query.path) {
    const rawPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    req.url = '/api/' + rawPath;
  } else if (req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  } else if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/push')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}

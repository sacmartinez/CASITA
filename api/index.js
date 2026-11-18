import app from '../server.js';

export default function handler(req, res) {
  try {
    const rawUrl = req.url || '';
    const qIndex = rawUrl.indexOf('?');
    const queryString = qIndex !== -1 ? rawUrl.substring(qIndex + 1) : '';
    const params = new URLSearchParams(queryString);

    let resolvedSubpath = params.get('__path') || params.get('path');
    if (!resolvedSubpath && req.query) {
      resolvedSubpath = req.query.__path || req.query.path;
      if (Array.isArray(resolvedSubpath)) resolvedSubpath = resolvedSubpath.join('/');
    }

    if (resolvedSubpath) {
      params.delete('__path');
      params.delete('path');
      const remainingQuery = params.toString();
      const cleanSub = resolvedSubpath.startsWith('/') ? resolvedSubpath.slice(1) : resolvedSubpath;
      const prefix = cleanSub.startsWith('api/') ? '/' : '/api/';
      req.url = `${prefix}${cleanSub}${remainingQuery ? '?' + remainingQuery : ''}`;
    } else {
      const matched = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'] || req.headers['x-rewrite-url'] || req.headers['x-invoke-path'];
      if (matched && matched !== '/api/index.js' && matched !== '/api') {
        req.url = matched;
      }
    }
  } catch (err) {
    console.error('Error restaurando req.url en api/index.js:', err);
  }
  return app(req, res);
}

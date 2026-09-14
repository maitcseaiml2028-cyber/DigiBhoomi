/* Minimal hash-based router that mimics the react-router-dom v6 subset we use:
 *   HashRouter, Routes, Route, Navigate, Link, NavLink, Outlet,
 *   useNavigate, useLocation, useParams
 */
(function(){
  const { createContext, useContext, useState, useEffect, useMemo, createElement: h } = React;

  const RouterCtx = createContext({ path:'/', search:'', navigate:()=>{} });
  const RouteCtx  = createContext({ params:{} });

  function parseHash(){
    let raw = location.hash.replace(/^#/, '') || '/';
    const q = raw.indexOf('?');
    const path = q >= 0 ? raw.slice(0,q) : raw;
    const search = q >= 0 ? raw.slice(q) : '';
    return { path: path || '/', search };
  }

  function HashRouter({ children }){
    const [loc, setLoc] = useState(parseHash);
    useEffect(() => {
      const on = () => setLoc(parseHash());
      window.addEventListener('hashchange', on);
      if(!location.hash) location.hash = '#/';
      return () => window.removeEventListener('hashchange', on);
    }, []);
    const navigate = (to, opts={}) => {
      if(typeof to === 'number'){ history.go(to); return; }
      if(opts.replace) location.replace('#' + to);
      else location.hash = '#' + to;
    };
    return h(RouterCtx.Provider, { value:{ ...loc, navigate } }, children);
  }

  // ---- path matching ----
  function compile(pattern){
    const keys = [];
    const rx = new RegExp('^' + pattern.replace(/\/$/, '').replace(/:[^/]+/g, (m) => {
      keys.push(m.slice(1));
      return '([^/]+)';
    }).replace(/\*$/, '.*') + '/?$');
    return { rx, keys };
  }

  function match(pattern, path){
    if(pattern === '*') return { params:{} };
    const { rx, keys } = compile(pattern);
    const m = rx.exec(path.replace(/\/$/, '') || '/');
    if(!m) return null;
    const params = {};
    keys.forEach((k,i)=> params[k] = decodeURIComponent(m[i+1]));
    return { params };
  }

  function Routes({ children }){
    const { path } = useContext(RouterCtx);
    const arr = React.Children.toArray(children);
    for(const child of arr){
      if(!child || !child.props) continue;
      const p = child.props.path;
      const m = match(p, path);
      if(m){
        return h(RouteCtx.Provider, { value:{ params: m.params } }, child.props.element);
      }
    }
    return null;
  }

  function Route(){ return null; } // consumed by Routes

  function Navigate({ to, replace }){
    const { navigate } = useContext(RouterCtx);
    useEffect(() => { navigate(to, { replace }); }, []);
    return null;
  }

  function Link({ to, children, className, style, onClick, ...rest }){
    const { navigate } = useContext(RouterCtx);
    return h('a', {
      href: '#' + to, className, style, onClick: (e) => {
        onClick?.(e);
        if(e.defaultPrevented) return;
        // Let hashchange handle it, but ensure no reload
      },
      ...rest,
    }, children);
  }

  function NavLink({ to, children, className, style, end, ...rest }){
    const { path } = useContext(RouterCtx);
    const isActive = end ? path === to : (path === to || path.startsWith(to + '/'));
    const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
    return h('a', {
      href: '#' + to,
      className: resolvedClassName,
      style: typeof style === 'function' ? style({ isActive }) : style,
      ...rest,
    }, typeof children === 'function' ? children({ isActive }) : children);
  }

  function Outlet(){ return null; }

  function useNavigate(){
    const { navigate } = useContext(RouterCtx);
    return navigate;
  }
  function useLocation(){
    const { path, search } = useContext(RouterCtx);
    return { pathname: path, search, hash:'', state:null };
  }
  function useParams(){
    return useContext(RouteCtx).params;
  }

  window.ReactRouterDOM = {
    HashRouter, Routes, Route, Navigate, Link, NavLink, Outlet,
    useNavigate, useLocation, useParams,
  };
})();

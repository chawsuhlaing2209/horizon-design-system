// The DOM helper the components are built from. Plain HTML on purpose: the
// design system should not need a UI framework to render, and staying
// framework-free keeps it usable if the products later arrive in React, Vue or
// anything else.
//
// This lives in src/ because it is product code. stories/lib/ui.js re-exports
// it so the token docs share one implementation rather than a copy.

export const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of [children].flat(Infinity)) {
    if (c == null || c === false) continue;
    node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return node;
};

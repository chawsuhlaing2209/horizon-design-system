// The token-docs pages build plain DOM through `el()` — deliberately, so they
// keep working whatever framework the components use. Under the React renderer
// a DOM node is not a valid child, so this hosts one inside a React element.
//
// Components do not use this. It exists only so the docs survived the move to
// @storybook/react-vite without being rewritten.

import { useEffect, useRef } from 'react';

export const DomHost = ({ node }: { node: Node }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren(node);
    return () => host.replaceChildren();
  }, [node]);

  return <div ref={ref} />;
};

/**
 * Wraps a DOM node as a React element.
 *
 * Each docs story is defined as `const X_raw = () => <dom node>` and exported as
 * `export const X = () => dom(X_raw())`. A meta-level `render` cannot do this
 * job: when a CSF story is exported as a function, that function *is* the
 * story's render and takes precedence over the meta, so the DOM node reaches
 * React unwrapped and React refuses it.
 *
 * Callable from plain .js, so the docs files need no JSX and stay untyped.
 */
export const dom = (node: Node) => <DomHost node={node} />;

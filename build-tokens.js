// Runner for the token build. Configuration lives in style-dictionary.config.js
// (tools.md names that file as the token config).

import { CORE, STYLES, src, css, native } from './style-dictionary.config.js';

// :root — core, light colours, web space + type, styles
await css('tokens.css',
  [CORE, src('semantic-color.light.tokens.json'), src('semantic-space.web.tokens.json'),
   src('type.web.tokens.json'), ...STYLES],
  ':root').buildAllPlatforms();

// dark — only the colours that change
await css('tokens-dark.css',
  [CORE, src('semantic-color.dark.tokens.json')],
  '[data-theme="dark"]',
  (t) => t.filePath.includes('semantic-color.dark')).buildAllPlatforms();

// iOS + Android — mobile mode
await native([CORE, src('semantic-color.light.tokens.json'),
  src('semantic-space.mobile.tokens.json'), src('type.mobile.tokens.json'),
  ...STYLES]).buildAllPlatforms();

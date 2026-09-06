// React only treats act() as supported when this flag is set. Without it every
// act() call warns, which drowns real failures in noise.
// https://react.dev/reference/react/act#error-the-current-testing-environment-is-not-configured-to-support-act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

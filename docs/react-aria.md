---
id: react-aria-md
title: "React Aria / React Spectrum — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# React Aria / React Spectrum — Conventions & Examples

## Conventions
1. Apply returned props to the correct DOM nodes for a11y.
2. Use focus ring utilities provided by the library.
3. Wrap app in `I18nProvider` and test RTL early.

## Examples
```tsx
import { useButton } from "react-aria";
function Button(props) {
  const ref = React.useRef();
  const { buttonProps } = useButton(props, ref);
  return <button {...buttonProps} ref={ref} />;
}
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [React docs](https://react.dev)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._


---
id: radix-ui-md
title: "Radix UI — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
---
# Radix UI — Conventions & Examples

## Conventions
1. Wrap primitives into project-level components.
2. Keep accessible defaults and visible focus styles.
3. Centralize overlay portals/z-index layers.

## Examples
```tsx
import * as Dialog from "@radix-ui/react-dialog";
export function AppDialog(props: Dialog.DialogProps) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger asChild><button>Open</button></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 m-auto max-w-md rounded-xl bg-white p-6" />
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [General web docs](https://developer.mozilla.org/)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._


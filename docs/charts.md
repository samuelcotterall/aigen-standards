---
id: charts-md
title: Charts (Recharts / Chart.js React) — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# Charts (Recharts / Chart.js React) — Conventions & Examples

## Conventions
1. Data adapters to map backend → chart series.
2. Responsive container wrappers.
3. Theme from design tokens; avoid hardcoded colors.

## Examples
```tsx
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
export function RevenueChart({ data }: { data: Array<{ x: string; y: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="x" /><YAxis /><Tooltip />
        <Line type="monotone" dataKey="y" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [React docs](https://react.dev)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._


---
id: charts-md
title: "Charts (Recharts / Chart.js React) — Conventions & Examples"
topics: []
scope: []
version: "any"
sections: [conventions, examples]
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

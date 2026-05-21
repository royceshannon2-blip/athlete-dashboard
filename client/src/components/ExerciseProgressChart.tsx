import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SessionSummary, toDisplayWeight } from "@/hooks/use-weight-log";

interface ExerciseProgressChartProps {
  sessions: SessionSummary[];
  unit: "lbs" | "kg";
  height?: number;
}

interface ChartDataPoint {
  date: string;
  maxWeight: number;
  totalVolume: number;
}

export function ExerciseProgressChart({ sessions, unit, height = 256 }: ExerciseProgressChartProps) {
  if (sessions.length === 0) {
    return (
      <div style={{ height: `${height}px` }} className="flex items-center justify-center border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-sm text-center px-4">
          No weight data yet for this exercise. Complete a session to see your progress.
        </p>
      </div>
    );
  }

  const data: ChartDataPoint[] = sessions.map((session) => ({
    date: session.date,
    maxWeight: toDisplayWeight(session.maxWeightKg, unit),
    totalVolume: toDisplayWeight(session.totalVolumeKg, unit),
  }));

  const unitLabel = unit === "lbs" ? "lbs" : "kg";

  return (
    <div data-testid="progression-chart" style={{ height: `${height}px` }} className="w-full border border-slate-700 rounded-lg overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 80, bottom: 20, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            stroke="#64748b"
            label={{ value: `Max Weight (${unitLabel})`, angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            stroke="#64748b"
            label={{ value: `Total Volume (${unitLabel})`, angle: 90, position: "insideRight" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e2e8f0" }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="maxWeight"
            stroke="#00f0ff"
            name={`Max Weight (${unitLabel})`}
            dot={{ fill: "#00f0ff", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Bar
            yAxisId="right"
            dataKey="totalVolume"
            fill="#39ff14"
            name={`Total Volume (${unitLabel})`}
            opacity={0.6}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

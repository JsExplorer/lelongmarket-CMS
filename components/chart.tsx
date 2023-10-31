"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts";

interface ChartProps {
    data: any[];
};

export const Chart: React.FC<ChartProps> = ({
    data
}) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={true}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={true}
                tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 4, 4]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
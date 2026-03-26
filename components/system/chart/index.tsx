'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Clapperboard } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

// Definindo o tipo dos dados de presença
interface LecturePresence {
    lecture: string;
    presence: number;
}

// Props esperadas pelo componente
interface ChartOverviewProps {
    name: string;
    chartData: LecturePresence[];
}

export function ChartOverview({ name, chartData }: ChartOverviewProps) {
    const chartConfig = {
        presence: {
            label: "presence",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig;

    return (
        <Card className="w-full md:w-1/2">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <CardTitle className="text-lg sm:text-xl text-gray-800">
                        {name}
                    </CardTitle>
                    <Clapperboard className="ml-auto w-4 h-4" />
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="lecture"
                            tickLine={false}
                            tickMargin={20}
                            axisLine={false}
                            textAnchor="end"
                        />
                        <YAxis
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Bar dataKey="presence" fill="var(--blue)" radius={4}>
                            <LabelList
                                dataKey="presence"
                                position="insideTop"
                                formatter={(value: number) => `${value}%`}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

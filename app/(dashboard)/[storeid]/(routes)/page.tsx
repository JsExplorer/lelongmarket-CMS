import { getRevenue } from "@/actions/get-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStocksCount } from "@/actions/get-stocks-count";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";
import { BadgeDollarSign, ShoppingBag, Store } from "lucide-react";
import { Chart } from "@/components/chart";
import { getChartRevenue } from "@/actions/get-chart-revenue";

interface DashboardPageProps {
    params: { storeId: string}
}

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
}) => {
    const revenue = await getRevenue(params.storeId);
    const salesCount = await getSalesCount(params.storeId);
    const stocksCount = await getStocksCount(params.storeId);
    const chartOverview = await getChartRevenue(params.storeId);

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-5 p-8 pt-5">
                <Heading title="Dashboard" description="Overview of store"/>
                <Separator />
                <div className="grid gap-3 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-4">
                            <CardTitle className="">
                            Revenue
                            </CardTitle>
                            <BadgeDollarSign className="text-gray-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {priceFormatter.format(revenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-4">
                            <CardTitle className="text-l">
                            Sales
                            </CardTitle>
                            <ShoppingBag className="text-gray-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-4">
                            <CardTitle className="text-l">
                            Products in Store
                            </CardTitle>
                            <Store className="text-gray-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {stocksCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-4">
                            <CardTitle className="text-l">
                            Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Chart data={chartOverview}/>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;
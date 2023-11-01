import prismadb from "@/lib/prismadb";
import { string } from "zod";

interface ChartData  {
    name: string;
    total: number;
}

export const getChartRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const monthlyRevenue: { [key: number]: number } = {};

    for ( const order of paidOrders) {
        const month = order.createdAt.getMonth();
        let revenueFromOrder = 0;

        for (const item of order.orderItems) {
            revenueFromOrder += item.product.price.toNumber()
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueFromOrder;
    };

    const chartData: ChartData[] = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 },
      ];

    for (const month in monthlyRevenue){
        chartData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return chartData;
}
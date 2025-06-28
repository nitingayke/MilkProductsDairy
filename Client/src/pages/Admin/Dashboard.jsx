import InventorySummary from "../../components/AdminComponents/DashboardComponents/InventorySummary";
import SalesOverview from "../../components/AdminComponents/DashboardComponents/SalesOverview";
import { ProductsStock } from "../../components/AdminComponents/DashboardComponents/ProductsStock";
import Statistics from "../../components/AdminComponents/DashboardComponents/Statastics";
import LowQuantityStock from "../../components/AdminComponents/DashboardComponents/LowQuantityStock";
import TopSellingStock from "../../components/AdminComponents/DashboardComponents/TopSellingStock";
import { getExpiryStatusCounts, lowStockCount, outOfStockProducts, totalStock } from "../../utils/InventoryHelpers/inventoryOverviewHelper";
import { useContext } from "react";
import OrdersOverview from "../../components/AdminComponents/DashboardComponents/PurchaseOverview";
import { totalActiveOrders } from "../../services/orderService";
import { calculateTotalProfit, getTotalRevenue, topSellingStocks } from "../../utils/DashboardHelpers/salesOverviewHelper";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ProductContext } from "../../context/ProductProvider";
import { AdminOrderContext } from "../../context/AdminOrderProvider";


export default function Dashboard() {

    const {allOrders} = useContext(AdminOrderContext)
    const { products } = useContext(ProductContext)

    const { expiredCount, expiringSoonCount } = getExpiryStatusCounts(products);
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const fadeInVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } }
    };


    return (
        <>
            <section className="p-3">
                <motion.div
                    variants={fadeUpVariant}
                    initial="hidden"
                    animate="visible"
                >
                    <SalesOverview totalRevenue={getTotalRevenue(allOrders)} totalProfit={calculateTotalProfit(allOrders)} />
                </motion.div>
            </section>


            <motion.section
                variants={fadeInVariant}
                initial="hidden"
                animate="visible"
                className="w-full flex flex-col md:flex-row gap-4 p-3"
            >
                <motion.section
                    className="flex-1 flex flex-col gap-4"
                    variants={fadeInVariant}
                >
                    <motion.div variants={fadeUpVariant} className="w-full">
                        <InventorySummary
                            totalProducts={products?.length}
                            totalStock={totalStock(products)}
                            lowStockCount={lowStockCount(products)}
                            outOfStockProducts={outOfStockProducts(products)}
                            expiringSoonCount={expiringSoonCount}
                            expiredCount={expiredCount}
                        />
                    </motion.div>


                    <motion.div variants={fadeUpVariant} className="w-full">
                        <OrdersOverview
                            totalOrdersRecieved={allOrders?.length}
                            totalPendingOrders={totalActiveOrders(allOrders)}
                        />
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="w-full">
                        <Statistics />
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="w-full">
                        <TopSellingStock topSellingStocks={topSellingStocks(products)} />
                    </motion.div>
                </motion.section>

                <motion.section
                    className="flex flex-col gap-4 md:w-80"
                    variants={fadeInVariant}
                >
                    <motion.div variants={fadeUpVariant} className="w-full">
                        <ProductsStock fetchedProducts={products} />
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="w-full">
                        <LowQuantityStock fetchedProducts={products} />
                    </motion.div>
                </motion.section>
            </motion.section>
        </>
    )
}
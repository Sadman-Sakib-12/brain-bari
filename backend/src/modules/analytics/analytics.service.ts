import prisma from '../../config/prisma';

const getAdminDashboardAnalytics = async () => {
  const [
    totalUsers,
    totalOrders,
    pendingOrders,
    completedOrders,
    inProgressOrders,
    totalBookings,
    payments,
    allOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.order.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.booking.count(),
    prisma.payment.findMany({
      where: { status: 'COMPLETED' },
      select: { amount: true, createdAt: true },
    }),
    prisma.order.findMany({
      select: { category: true, status: true, quotePrice: true },
    }),
  ]);

  // Calculate total revenue
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  // Group revenue by Month for Recharts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyDataMap: Record<string, { month: string; revenue: number; transactions: number }> = {};

  // Initialize last 6 months
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthlyDataMap[key] = {
      month: monthNames[d.getMonth()],
      revenue: 0,
      transactions: 0,
    };
  }

  payments.forEach((payment) => {
    const d = new Date(payment.createdAt);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (monthlyDataMap[key]) {
      monthlyDataMap[key].revenue += payment.amount;
      monthlyDataMap[key].transactions += 1;
    }
  });

  const monthlyChartData = Object.values(monthlyDataMap);

  // Category distribution
  const categoryCountMap: Record<string, number> = {};
  allOrders.forEach((o) => {
    categoryCountMap[o.category] = (categoryCountMap[o.category] || 0) + 1;
  });

  const categoryDistribution = Object.keys(categoryCountMap).map((cat) => ({
    category: cat,
    count: categoryCountMap[cat],
  }));

  return {
    overview: {
      totalRevenue,
      totalUsers,
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalBookings,
    },
    monthlyChartData,
    categoryDistribution,
  };
};

export const AnalyticsService = {
  getAdminDashboardAnalytics,
};

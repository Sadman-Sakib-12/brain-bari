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

  // Query real recent database events for the activity log (no mock data)
  const [recentOrders, recentBookings, recentUsers] = await Promise.all([
    prisma.order.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        serviceName: true,
        clientName: true,
        status: true,
        quotePrice: true,
        updatedAt: true,
      },
    }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        topic: true,
        status: true,
        timeSlot: true,
        updatedAt: true,
      },
    }),
    prisma.user.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const recentActivities = [
    ...recentOrders.map((o) => ({
      id: `act-ord-${o.id}`,
      action: o.status === 'APPROVED' ? `Quote Assigned: $${o.quotePrice || 0}` : `Order ${o.status.charAt(0) + o.status.slice(1).toLowerCase()}`,
      details: `${o.clientName || 'Client'} requested '${o.serviceName}'`,
      time: o.updatedAt,
      type: 'order',
      user: o.clientName || 'Client',
    })),
    ...recentBookings.map((b) => ({
      id: `act-bkg-${b.id}`,
      action: `Consultation: ${b.status.charAt(0) + b.status.slice(1).toLowerCase()}`,
      details: `${b.name} booked '${b.topic}' at ${b.timeSlot}`,
      time: b.updatedAt,
      type: 'booking',
      user: b.name,
    })),
    ...recentUsers.map((u) => ({
      id: `act-usr-${u.id}`,
      action: `User Registered (${u.role})`,
      details: `${u.name} (${u.email}) registered on platform`,
      time: u.createdAt,
      type: 'user',
      user: u.name,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

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
    recentActivities,
  };
};

export const AnalyticsService = {
  getAdminDashboardAnalytics,
};

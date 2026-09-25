import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { ServiceRoutes } from '../modules/service/service.routes';
import { ChatbotRoutes } from '../modules/chatbot/chatbot.routes';
import { PortfolioRoutes } from '../modules/portfolio/portfolio.routes';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { FaqRoutes } from '../modules/faq/faq.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { BookingRoutes } from '../modules/booking/booking.routes';
import { CmsRoutes } from '../modules/cms/cms.routes';
import { AnalyticsRoutes } from '../modules/analytics/analytics.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/services', route: ServiceRoutes },
  { path: '/chatbots', route: ChatbotRoutes },
  { path: '/portfolios', route: PortfolioRoutes },
  { path: '/blogs', route: BlogRoutes },
  { path: '/faqs', route: FaqRoutes },
  { path: '/orders', route: OrderRoutes },
  { path: '/payments', route: PaymentRoutes },
  { path: '/bookings', route: BookingRoutes },
  { path: '/cms', route: CmsRoutes },
  { path: '/analytics', route: AnalyticsRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;

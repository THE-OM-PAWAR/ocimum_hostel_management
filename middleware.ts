import { authMiddleware} from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ["/", "/refund", "/return", "/terms", "/privacy", "/about", "/contact", "/legal"],
  ignoredRoutes: ["/api/webhook"],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
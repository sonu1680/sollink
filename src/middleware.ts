import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // redirect here if not authenticated
  },
});

// Apply middleware to these paths
export const config = {
  matcher: ["/"], // protect these routes
};

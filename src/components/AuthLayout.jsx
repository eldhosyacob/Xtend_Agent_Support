'use client';

import { hasAccess, publicRoutes } from '../utils/roleAccess';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import HeaderSidebar from "@/components/HeaderSidebar/page";
import NextTopLoader from 'nextjs-toploader';
import { loaderTemplate } from './loaderTemplate';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from './styles/MuiTheme';
import { CssBaseline } from '@mui/material';

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {

    // Check if the current route is a public route
    return;
    if (publicRoutes.includes(pathname)) {
      console.log("AuthLayout: Public route: ", pathname);
      return; // Allow access to public routes without authentication
    }

    // Check if user is authenticated
    if (!user) {
      console.log("AuthLayout: User not authenticated");
      router.push('/Login');
      return;
    }

    const userRoles = user.roles || 'user';

    // Check access based on route and role
    if (!hasAccess(pathname, userRoles)) {
      console.log(`AuthLayout: Access denied to ${pathname} for role ${userRoles}`);
      router.push('/access-denied');
    }
  }, []);

  // Full screen routes don't need the HeaderSidebar
  const fullScreenRoutes = ['/Login', '/access-denied', '/ForgotPassword', '/ResetPassword'];
  const isFullScreenRoute = fullScreenRoutes.includes(pathname);

  return (
    <>
      <NextTopLoader
        // height={5}
        // showSpinner={false}
        template={loaderTemplate}
      />
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {isFullScreenRoute ? (
          children
        ) : (
          // <Suspense fallback={<div>Loading...</div>}>
            <HeaderSidebar>
              {children}
            </HeaderSidebar>
          // </Suspense>
        )}
      </ThemeProvider>
    </>
  );
} 
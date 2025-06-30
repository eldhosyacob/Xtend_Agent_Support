// Super Admin can access all routes no need to explicitly mention
const protectedRoutes = {
  '/Courses': ['Content Editor', 'Content Supervisor'],
  '/Courses/Languages': ['Content Editor', 'Content Supervisor'],
  '/Courses/Languages/New': ['Content Editor'],
  '/Courses/Languages/[id]': ['Content Editor'],
  '/Courses/Types': ['Content Editor', 'Content Supervisor'],
  '/Courses/Types/New': ['Content Editor'],
  '/Courses/Types/[id]': ['Content Editor'],

  '/Users': ['Super Admin'],
  '/UserCreateEdit': ['Super Admin'],
};

// Routes that don't require any validation
export const publicRoutes = [
  '/ForgotPassword',
  '/Login', //Not required since already redirecting to /Login if no user is found in AuthLayout.jsx
  '/ResetPassword',
];

export const hasAccess = (Route, userRoles) => {
  if (!protectedRoutes[Route]) return true;
  if (userRoles.includes('Super Admin')) return true;
  return userRoles.some(role => protectedRoutes[Route].includes(role));
};
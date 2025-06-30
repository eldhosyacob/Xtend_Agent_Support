'use client';
import { logout } from '@/redux/authSlice';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import { useDispatch, useSelector } from 'react-redux';

const useAuthAxios = () => {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const sessionToken = user?.["sessionToken"];
  // console.log(sessionToken);

  const authAxiosHandler = async (config = {}) => {
    // if (!sessionToken) {
    //   console.log("AuthAxios: No session token");
    //   router.push("/Login");
    //   return null;
    // }

    //try catch is required to prevent error being thrown
    // on forced abort, as well as to catch session token
    // errors and redirect to login page

    try {
      NProgress.start();
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['sessionToken'] = sessionToken;
      const response = await axios({
        ...config,
      });

      return response;

    } catch (error) {

      if (axios.isCancel(error)) {
        console.log(`API Aborted: ${config.url}`);
        return null;
      } else if (axios.isAxiosError(error)) {
        const errorCode = error?.response?.status;
        // if the error code is 400 or 401, redirect to login page
        console.log(errorCode);
        if (errorCode === 401) {
          console.log("AuthAxios: Server side validation failed");
          dispatch(logout());
          router.push(`/Login?redirect=${encodeURIComponent(pathname)}`);
          return null;
        } else {
          const axiosError = new Error(`[${errorCode}] ${error.message}\n(API: ${config.url})`);
          throw axiosError;
        }
      }
      // For non-Axios errors, throw as is
      throw error;

    } finally {
      NProgress.done();
    }
  };

  return authAxiosHandler;
};

export default useAuthAxios;

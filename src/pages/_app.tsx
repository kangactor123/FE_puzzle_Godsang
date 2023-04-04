import React, { useState } from 'react';
import { Global } from '@emotion/react';
import type { AppProps } from 'next/app';
import { globalStyle } from 'src/core/styles/global';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { createTheme, ThemeProvider } from '@mui/material';
import { SessionProvider } from 'next-auth/react';

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          textAlign: 'left',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          border: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
          height: '60px',
          background: '#f3f3f3',
          borderRadius: '6px',
          fontFamily: 'GmarketSans',
          fontSize: '13px',
          lineHeight: '20px',
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <Global styles={globalStyle} />
            <Component {...pageProps} />
          </ThemeProvider>
        </RecoilRoot>
      </SessionProvider>
    </QueryClientProvider>
  );
}

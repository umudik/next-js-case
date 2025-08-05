'use client';

import { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import ClientOnlyMap from '../components/ClientOnlyMap';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Loading application...</Typography>
      </Box>
    );
  }

  return <ClientOnlyMap />;
}

import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

type ScreenLoaderProps = {
  message?: string; // Mensagem opcional a ser exibida
  open: boolean; // Controla a exibição do loader
};

const ScreenLoader: React.FC<ScreenLoaderProps> = ({ message = 'Carregando...', open }) => {
  return (
    <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.modal }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6">{message}</Typography>
      </Box>
    </Backdrop>
  );
};

export default ScreenLoader;

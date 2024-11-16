import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {

  async function sendPasswordReset() {
    try {
      const email = document.getElementById('email') as HTMLInputElement;
      await sendPasswordResetEmail(auth, email.value);
      console.log("E-mail de redefinição de senha enviado com sucesso.");
      alert("Por favor, verifique seu e-mail para redefinir a senha.");
    } catch (error: any) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error.message);
      alert("Erro ao enviar e-mail de redefinição. Verifique o endereço de e-mail e tente novamente.");
    }
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleClose();
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="button" onClick={sendPasswordReset}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

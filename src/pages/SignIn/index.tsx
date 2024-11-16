import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon  } from './CustomIcons';
import AppTheme from '../shared-theme/AppTheme';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { getUserDataByEmail, setUserData, UserData, UserGenericData } from '../../services/user';
import { Card } from '../../components/card';
import { Container } from '../../components/container';
import { getUserVoteData } from '../../services/vote';

export function SignIn(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const [user, setUser] = React.useState<User>({} as User);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Por favor entre com um email válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Sua senha precisa ter pelo menos 6 caracteres.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  async function signUpWithEmail() {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    if (validateInputs()) {
      try {
        // valida com e-mail e senha
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user;
        const userRevelacao = await getUserDataByEmail(user.email as string)
        const userData = {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          relationship: userRevelacao?.relationship,
          typeLink: userRevelacao?.typeLink
        } as UserData;

        const userVote = await getUserVoteData(user.uid)
      if (userVote) {
        navigate('/dashboard', { state: { userHistory: {
          ...userData, 
          relationship: userRevelacao?.relationship, 
          typeLink: userRevelacao?.typeLink, 
          vote: userVote.gender 
        } } })
        return
      }

        navigate('/vote', { state: { user: userData } });
      } catch (error: any) {
        console.error("Erro ao criar usuário:", error.message);
        navigate('/register')
      }
    } else {

    }
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user
      setUser(user);
      const userData: UserData = {
        name: user.displayName as string,
        email: user.email as string,
        uid: user.uid,
        photoURL: user.photoURL as string
      };

      const userRevelacao: UserGenericData | null = await getUserDataByEmail(user.email as string)
      if (userRevelacao) {
        const relacionamento = userRevelacao['relationship']
        if (!relacionamento || (typeof relacionamento === 'string' && relacionamento === "")) {
          navigate('/update-profile', { state: { userHistory: userData } })
          return
        }
      } else {
        setUserData(user.displayName as string, user.email as string, user.uid, user.photoURL as string, "", "")
        navigate('/update-profile', { state: { userHistory: userData } })
        return
      }

      const userVote = await getUserVoteData(user.uid)
      if (userVote) {
        navigate('/dashboard', { state: { userHistory: {
          ...userData, 
          relationship: userRevelacao.relationship, 
          typeLink: userRevelacao.typeLink, 
          vote: userVote.gender 
        } } })
        return
      }
        
      navigate('/vote', { state: { user: userData } });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Entrar
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Senha</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Esqueceu sua senha?
                </Link>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={signUpWithEmail}
            >
              Entrar
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Não tem conta?{' '}
              <span>
                <Link
                  href="/register"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Cadastrar
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>ou</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => signInWithGoogle()}
              startIcon={<GoogleIcon />}
            >
              Entrar com conta Google
            </Button>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}
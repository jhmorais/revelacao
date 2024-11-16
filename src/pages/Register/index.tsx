import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppTheme from '../shared-theme/AppTheme';
import { createUserWithEmailAndPassword, updateProfile, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { Card } from '../../components/card';
import { Container } from '../../components/container';
import { setUserData } from '../../services/user';
import { Fade, FormControlLabel, IconButton, Radio, RadioGroup, Tooltip, Zoom } from '@mui/material';
import { InfoRounded } from '@mui/icons-material';

export function Register(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [nomeError, setNomeError] = React.useState(false);
  const [nomeErrorMessage, setNomeErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [typeLink, setTypeLink] = React.useState<string>('familia')
  const [relationship, setRelationship] = React.useState<string>('mae')

  const navigate = useNavigate();
  const [user, setUser] = React.useState<User>({} as User);

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
    const nome = document.getElementById('nome') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!nome.value || nome.value.length < 3) {
      setEmailError(true);
      setEmailErrorMessage('Por favor entre com um nome válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

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

  async function registerWithEmail() {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const displayName = document.getElementById('nome') as HTMLInputElement;
    if (validateInputs()) {
      try {
        // Cria o usuário com e-mail e senha
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        await updateProfile(user, { displayName: displayName.value });

        // relationship: pai ou mãe
        // typeLink: familiar ou amigo
        setUserData(displayName.value, user.email as string, user.uid, user.photoURL as string, typeLink, relationship)
        const userData = {
          name: displayName.value,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          typeLink: typeLink,
          relationship: relationship
        };

        navigate('/vote', { state: { user: userData } });
      } catch (error: any) {
        console.error("Erro ao criar usuário:", error.message);
        throw error;
      }
    } else {

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
            Registrar
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
              <FormLabel htmlFor="email">Nome</FormLabel>
              <TextField
                error={nomeError}
                helperText={nomeErrorMessage}
                id="nome"
                type="nome"
                name="nome"
                placeholder="seu nome"
                autoComplete="nome"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={nomeError ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
              />
            </FormControl>
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
            <FormControl>
              <FormLabel id="radio-buttons-vinculo">Vínculo</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="familia"
                value={typeLink}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTypeLink((event.target as HTMLInputElement).value)}
                name="radio-buttons-group"
              >
                <FormControlLabel value="familia" control={<Radio />} label="Família" />
                <FormControlLabel value="amigo" control={<Radio />} label="Amigo" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="radio-buttons-relacionamento" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Relacionamento
                <Tooltip
                  placement="right"
                  arrow
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 300 }}
                  title="Seu vínculo familiar/amigo é com a mãe ou o pai.">
                  <InfoRounded />
                </Tooltip>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="familia"
                value={relationship}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRelationship((event.target as HTMLInputElement).value)}
                name="radio-buttons-group"
              >
                <FormControlLabel value="pai" control={<Radio />} label="Pai" />
                <FormControlLabel value="mae" control={<Radio />} label="Mãe" />
              </RadioGroup>
            </FormControl>
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={registerWithEmail}
            >
              Enviar
            </Button>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}
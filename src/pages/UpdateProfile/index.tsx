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
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { Card } from '../../components/card';
import { Container } from '../../components/container';
import { setUserData } from '../../services/user';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Swal from 'sweetalert2'
import { Store } from 'react-notifications-component';
import { Tooltip, Zoom } from '@mui/material';
import { InfoRounded } from '@mui/icons-material';

export function UpdateProfile(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userHistory } = location.state || {};
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [nomeError, setNomeError] = React.useState(false);
  const [nomeErrorMessage, setNomeErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [typeLink, setTypeLink] = React.useState<string>('familia')
  const [relationship, setRelationship] = React.useState<string>('mae')

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

    let isValid = true;

    if (!nome.value || nome.value.length < 3) {
      setEmailError(true);
      setEmailErrorMessage('Por favor entre com um nome válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    return isValid;
  };

  async function updateProfile() {
    const displayName = document.getElementById('nome') as HTMLInputElement;
    if (validateInputs()) {
      try {
        setUserData(displayName.value, userHistory.email as string, userHistory.uid, userHistory.photoURL as string, typeLink, relationship)
        const userData = {
          name: displayName.value,
          email: userHistory.email,
          uid: userHistory.uid,
          photoURL: userHistory.photoURL,
          typeLink: typeLink,
          relationship: relationship
        };

        navigate('/vote', { state: { user: userData } });
      } catch (error: any) {
        console.error("Erro ao atualizar profile:", error.message);
        Store.addNotification({
          title: "Erro!",
          message: "Falha ao atualizar profile!",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: true
          }
        });
        throw error;
      }
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
            Atualizar Perfil
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
                value={userHistory?.name ?? ''}
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
              onClick={updateProfile}
            >
              Salvar
            </Button>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
}
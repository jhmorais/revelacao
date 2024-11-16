import './styles.scss';
import babyImage from '../../assets/baby.png';
import babyGirlImage from '../../assets/baby-girl.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/card';
import { Container } from '../../components/container';
import AppTheme from '../shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { setVoteData } from '../../services/vote';
import { Store } from 'react-notifications-component';
import Swal from 'sweetalert2';

export function Vote(props: { disableCustomTheme?: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: userHistory } = location.state || {};

    const [babyOption, setBabyOption] = useState<string | undefined>(undefined);

    function sendVote() {
        Swal.fire({
            title: "Atenção!",
            text: "Seu voto não pode ser alterado após o envio",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Enviar",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                if (babyOption) {
                    setVoteData(babyOption as string, userHistory.uid)
                    Store.addNotification({
                        title: "Parabéns!",
                        message: "Seu voto foi computado com sucesso!",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 3000,
                          onScreen: true
                        }
                      });

                      const userData = {
                        name: userHistory.name,
                        email: userHistory.email,
                        uid: userHistory.uid,
                        photoURL: userHistory.photoURL,
                        typeLink: userHistory.typeLink,
                        relationship: userHistory.relationship,
                        vote: babyOption
                      };
              
                      navigate('/dashboard', { state: { userHistory: userData } });
                }
            }
          });
    }

    const selectOption = (option: string) => {
        setBabyOption(option.toUpperCase())
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Container direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <div className="options">
                        <label className="radio-image">
                            <input type="radio" name="gender" value="menino" onClick={(e: React.MouseEvent<HTMLInputElement>) => selectOption(e.currentTarget.value)} />
                            <img src={babyImage} width={50} alt="Baby Boy" />
                        </label>

                        <label className="radio-image">
                            <input type="radio" name="gender" value="menina" onClick={(e: React.MouseEvent<HTMLInputElement>) => selectOption(e.currentTarget.value)} />
                            <img src={babyGirlImage} width={50} alt="Baby Boy" />
                        </label>
                    </div>

                    <div className="selected-result">
                        <p>Seleção: <span id="selection">{babyOption}</span></p>
                    </div>

                    <div className="sent-vote">
                        <button className="sent-button" onClick={sendVote} disabled={!babyOption}>Enviar</button>
                    </div>
                </Card>
            </Container>
        </AppTheme >
    );
}
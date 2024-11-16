import { useLocation, useNavigate } from 'react-router-dom';
import './styles.scss';
import { Box, Typography, Card, CssBaseline, Zoom, Tooltip as TooltipMaterial, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Container } from '../../components/container';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip, TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AppTheme from '../shared-theme/AppTheme';
import pixNubank from '../../assets/pix-nubank.jpg';
import qrcodeWise from '../../assets/qrcode-wise.jpg';
import babyGirl from '../../assets/baby-girl.png';
import babyBoy from '../../assets/baby.png';
import { InfoRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getVoteData, VoteData } from '../../services/vote';
import { useQuery } from 'react-query';
import { BOY } from '../../utils/const';
import ScreenLoader from '../../components/screenLoader';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Store } from 'react-notifications-component';

export function Dashboard(props: { disableCustomTheme?: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { userHistory } = location.state || {};
    const [boyPercentage, setBoyPercentege] = useState<number>(50)
    const [girlPercentage, setGirlPercentege] = useState<number>(50)
    const [vote, setVote] = useState<string>(userHistory.vote)
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

    const { data: votes, isLoading, error } = useQuery('getVotes', () => getVoteData())

    useEffect(() => {
        const girls: VoteData[] = []
        const boys: VoteData[] = []
        votes?.forEach((vote: VoteData) => {
            if (vote.gender === BOY) {
                boys.push(vote)
            } else {
                girls.push(vote)
            }
        })
        const total = votes?.length ?? 1
        setBoyPercentege(Math.round(boys.length * 100 / total))
        setGirlPercentege(Math.round(girls.length * 100 / total))
    }, [votes])

    // Configurações do Chart.js
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const voteData = {
        labels: ['Menino', 'Menina'],
        datasets: [
            {
                label: 'Votos',
                data: [boyPercentage, girlPercentage],
                backgroundColor: ['#82ccdd', '#f8a5c2'],
            },
        ],
    };

    const voteOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Votos em Tempo Real',
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'bar'>) {
                        const value = context.raw as number;
                        return `${context.label}: ${value}%`;
                    },
                },
            },
        },
    };

    const handleCopy = async (textToCopy: string) => {
        try {
            await navigator.clipboard.writeText(textToCopy)
            Store.addNotification({
                title: "",
                message: "IBAN copiado com sucesso!",
                type: "info",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 3000,
                    onScreen: true
                }
            });
        } catch (error) {
            alert('Falha ao copiar o texto.')
            console.error('Erro ao copiar o texto:', error)
        }
    }

    function calculateTimeLeft() {
        const targetDate = new Date("2024-11-20T18:00:00Z").getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer); // Limpa o intervalo ao desmontar o componente
    }, []);
    // TODO mostrar na tela inicial quanto tempo falta para o chá
    // TODO Incorporar o video para passar o chá ao vivo eplo youtube ou instagram


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Container direction="column" justifyContent="space-between">
                <Typography variant="h6" align="center" marginBottom={'2rem'}>
                    🎉 Agradecemos pelo seu palpite, estamos muito felizes por poder contar com sua participação! 🥰
                </Typography>

                {/* Seção de QR Codes */}
                <Box sx={{ flexGrow: 1, display: 'flex', width: '100%' }}>
                    <Grid container spacing={4} width={'100%'}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                variant="outlined"
                                elevation={3}
                                sx={{
                                    width: '100%',
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Typography variant="h6" id="pix-nubank" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Contribua via Pix
                                    <TooltipMaterial
                                        placement="top"
                                        arrow
                                        TransitionComponent={Zoom}
                                        TransitionProps={{ timeout: 300 }}
                                        title="Para acessar a transferência via pix com QRcode, abra o aplicativo do seu banco, vá até a área de pix, selecione pagar com QRcode e aponte seu celular para o QRcode abaixo.">
                                        <InfoRounded />
                                    </TooltipMaterial>
                                </Typography>
                                <img src={pixNubank} height={300} alt="pix-Nubank" />

                                <Typography variant="body2">
                                    Conta Nubank: ***.241.061.*** (CPF)
                                    <br />
                                    João Henrique de Oliveira Morais
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                variant="outlined"
                                elevation={3}
                                sx={{
                                    width: '100%',
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Typography variant="h6" id="qrcode-wise" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Contribua via Wise
                                    <TooltipMaterial
                                        placement="top"
                                        arrow
                                        TransitionComponent={Zoom}
                                        TransitionProps={{ timeout: 300 }}
                                        title="Para acessar o pagamento com wise, abra a camera do seu celular e aponte para o QRcode do wise, e o aplicativo do wise será aberto.">
                                        <InfoRounded />
                                    </TooltipMaterial>
                                </Typography>
                                <img src={qrcodeWise} height={300} alt="qrcode-wise" />
                                <Typography variant="body2">
                                    Conta: ***.241.061.*** (CPF)
                                    <br />
                                    João Henrique de Oliveira Morais
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', marginTop: '2rem' }}>
                    <Grid container spacing={4} width={'100%'}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                variant="outlined"
                                elevation={3}
                                sx={{
                                    width: '100%',
                                    height: '100px',
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Grid container spacing={4} width={'100%'}>
                                    <Grid size={{ xs: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={vote === BOY ? babyBoy : babyGirl} width={50} alt="baby-image" />
                                    </Grid>
                                    <Grid size={{ xs: 10 }} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2" color={vote === BOY ? '#82ccdd' : '#f8a5c2'}>
                                            Seu voto: "{vote}"!
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                variant="outlined"
                                elevation={3}
                                sx={{
                                    width: '100%',
                                    height: '100px',
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Typography variant="caption">
                                    <strong>Contribua via Transferência de bancos europeus</strong>
                                </Typography>
                                <Typography variant="caption">
                                    <strong>IBAN:</strong> PT50 0023 0000 45666441142 94
                                    <TooltipMaterial title="Copiar">
                                        <IconButton onClick={() => handleCopy("PT50 0023 0000 45666441142 94")} sx={{ height: '10px', width: '10px', border: 'none' }}>
                                            <ContentCopyIcon sx={{ height: '10px' }} />
                                        </IconButton>
                                    </TooltipMaterial>
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                <Card
                    variant="outlined"
                    elevation={3}
                    sx={{
                        padding: 3,
                        width: '100%',
                        marginTop: '2em',
                        textAlign: 'center'
                    }}>
                    <Typography variant="h6" id="regressiva-title">
                        Contagem regressiva
                    </Typography>
                    <Typography variant="h1" id="cronometro">
                        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                    </Typography>
                </Card>

                {/* Gráfico de votos */}
                <Card
                    variant="outlined"
                    elevation={3}
                    sx={{
                        padding: 3,
                        width: '100%',
                        marginTop: '2em'
                    }}
                >
                    <Typography variant="h6" align="center" gutterBottom>
                        Status das Votações
                    </Typography>
                    <Bar options={voteOptions} data={voteData} />
                </Card>
                <ScreenLoader open={isLoading} message="Carregando dados, por favor, aguarde..." />
            </Container>
        </AppTheme >
    )
}
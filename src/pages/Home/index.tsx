import './styles.scss';
import babyImage from '../../assets/baby.png';
import babyGirlImage from '../../assets/baby-girl.png';
import { useNavigate } from 'react-router-dom';
import { getVoteData, VoteData } from '../../services/vote';
import { useQuery } from "react-query";
import { useEffect, useState } from 'react';
import { BOY } from '../../utils/const';
import { Typography } from '@mui/material';

export function Home() {
    const navigate = useNavigate();
    const [boyPercentage, setBoyPercentege] = useState<number>(50)
    const [girlPercentage, setGirlPercentege] = useState<number>(50)
    const { data: votes, isLoading, error } = useQuery('getVotes', () => getVoteData())
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

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
        const bPercentage = Math.round(boys.length * 100 / total)
        const gPercentage = Math.round(girls.length * 100 / total)
        setBoyPercentege((bPercentage === 0 || isNaN(bPercentage)) ? 50 : bPercentage)
        setGirlPercentege((gPercentage === 0 || isNaN(gPercentage)) ? 50 : gPercentage)
    }, [votes])

    async function vote() {
        navigate("/login")
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

    return (
        <div className="container">
            <div className="boy" style={{ width: `${boyPercentage}%` }}>

                <div className="inner-header flex">
                    <h1>
                        Menino
                        <img src={babyImage} width={50} alt="Baby" />
                    </h1>
                    <div className="percentage">
                        <h3>{boyPercentage}%</h3>
                    </div>
                </div>
            </div>
            <div className="girl" style={{ width: `${girlPercentage}%` }}>
                <div className="inner-header flex">
                    <h1>
                        Menina
                        <img src={babyGirlImage} width={50} alt="Baby" />
                    </h1>
                    <div className="percentage">
                        <h3>{girlPercentage}%</h3>
                    </div>
                </div>
            </div>

            <div className="center-button">
                <button className='vote-button' onClick={vote}>Votar Agora</button>
                <Typography variant="h3" id="cronometro" sx={{marginTop: '2rem', color: 'rgba(255, 255, 255, 0.8)', }}>
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </Typography>
            </div>
        </div>
    );
}
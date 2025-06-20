import { useState, useEffect } from 'react'
import Form from './components/Form'
import MemoryCard from './components/MemoryCard'
import AssistiveTechInfo from './components/AssistiveTechInfo'
import GameOver from './components/GameOver'
import ErrorCard from './components/ErrorCard'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import Home from './components/Home';
import About from './components/About';
import CustomNavbar from './components/CustomNavbar';
import { Container } from 'react-bootstrap';

export default function App() {
    const initialFormData = {category: "animals-and-nature", number: 10}
    
    const [formData, setFormData] = useState(initialFormData)
    const [isGameOn, setIsGameOn] = useState(false)
    const [emojisData, setEmojisData] = useState([])
    const [selectedCards, setSelectedCards] = useState([])
    const [matchedCards, setMatchedCards] = useState([])
    const [areAllCardsMatched, setAreAllCardsMatched] = useState(false)
    const [isError, setIsError] = useState(false)

    // Added for score 
    const [score, setScore] = useState(0);

    // This loads the saved high score from localStorage when the app starts
    const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem("highScore")) || 0;});

    // Add timer state
    const [timerId, setTimerId] = useState(null);

    // Add milestone state
    const [milestoneReached, setMilestoneReached] = useState(null);

    const [timeLeft, setTimeLeft] = useState(30);     // 30-second countdown
    const [isTimeUp, setIsTimeUp] = useState(false);  // Controls timeout logic





    
    useEffect(() => {
    if (selectedCards.length === 2) {
        if (selectedCards[0].name === selectedCards[1].name) {
            setMatchedCards(prevMatchedCards => [...prevMatchedCards, ...selectedCards])
            setScore(prevScore => prevScore + 10) // Add 10 points per correct match
        }
    }
    }, [selectedCards])

    
    useEffect(() => {
        if (emojisData.length && matchedCards.length === emojisData.length) { //
            setAreAllCardsMatched(true)
            if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("highScore", score.toString());
            }
        }
    }, [matchedCards])
    
    useEffect(() => {
    if (score > 0 && score % 100 === 0) {
        setMilestoneReached(score);
        const timeout = setTimeout(() => setMilestoneReached(null), 2000); // Hide after 2s
        return () => clearTimeout(timeout); // Cleanup
    }
}, [score]);


    function handleFormChange(e) {
        setFormData(prevFormData => ({...prevFormData, [e.target.name]: e.target.value}))
    }
    
    async function startGame(e) {
    e.preventDefault();

    try {
        const response = await fetch(`https://emojihub.yurace.pro/api/all/category/${formData.category}`);

        if (!response.ok) {
            throw new Error("Could not fetch data from API");
        }

        const data = await response.json();
        const dataSlice = await getDataSlice(data);
        const emojisArray = await getEmojisArray(dataSlice);

        // Set timer duration based on selected level
        let seconds;
        switch (formData.number) {
            case "10":
                seconds = 30;
                break;
            case "20":
                seconds = 90;
                break;
            case "30":
                seconds = 120;
                break;
            case "40":
                seconds = 160;
                break;
            case "50":
                seconds = 220;
                break;
            default:
                seconds = 30; // fallback
        }

        // Reset game state
        setEmojisData(emojisArray);
        setIsGameOn(true);
        setTimeLeft(seconds);     // <-- now 'seconds' is defined!
        setIsTimeUp(false);
        setScore(0);

        // Start countdown interval
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimerId(interval);
    } catch (err) {
        console.error(err);
        setIsError(true);
    }
}



    async function getDataSlice(data) {
        const randomIndices = getRandomIndices(data)
        
        const dataSlice = randomIndices.reduce((array, index) => {
            array.push(data[index])
            return array
        }, [])

        return dataSlice
    }

    function getRandomIndices(data) {        
        const randomIndicesArray = []
 
        for (let i = 0; i < (formData.number / 2); i++) {
            const randomNum = Math.floor(Math.random() * data.length)
            if (!randomIndicesArray.includes(randomNum)) {
                randomIndicesArray.push(randomNum)
            } else {
                i--
            }
        }
        
        return randomIndicesArray
    }

    async function getEmojisArray(data) {
        const pairedEmojisArray = [...data, ...data]
        
        for (let i = pairedEmojisArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = pairedEmojisArray[i]
            pairedEmojisArray[i] = pairedEmojisArray[j]
            pairedEmojisArray[j] = temp
        }
        
        return pairedEmojisArray
    }
    
    function turnCard(name, index) {
        if (isTimeUp) return; // Block interaction after timeout

        if (selectedCards.length < 2) {
            setSelectedCards(prevSelectedCards => [...prevSelectedCards, { name, index }])
        } else if (selectedCards.length === 2) {
            setSelectedCards([{ name, index }])
        }
    }
    
    function resetGame() {
        setIsGameOn(false)
        setSelectedCards([])
        setMatchedCards([])
        setAreAllCardsMatched(false)
        setScore(0) // reset score
        setIsTimeUp(false);
        setTimeLeft(30);
        if (timerId) clearInterval(timerId);

    }
    
    function resetError() {
        setIsError(false)
    }
    
    return (
      <Router>
        <CustomNavbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={
              <main>
                
                {isGameOn && !areAllCardsMatched && (
                <div className="score-section">
                    <h2>Score: {score}</h2>
                    <p>High Score: {highScore}</p>
                    <p>⏱️ Time left: {timeLeft}s</p>
                </div>
                )}

                {!isGameOn && !isError &&
                  <Form handleSubmit={startGame} handleChange={handleFormChange} />
                }
                {isGameOn && !areAllCardsMatched && 
                  <AssistiveTechInfo emojisData={emojisData} matchedCards={matchedCards} />}
                {areAllCardsMatched && <GameOver handleClick={resetGame} />}
                {isGameOn && (
                    <div className={`card-container-wrapper level-${formData.number}`}>
                        <MemoryCard
                        handleClick={turnCard}
                        data={emojisData}
                        selectedCards={selectedCards}
                        matchedCards={matchedCards}
                        />
                    </div>
                )}

                {isError && <ErrorCard handleClick={resetError} />}
                {milestoneReached && (
                  <div className="milestone-popup">
                    🎉 Milestone reached! Score: {milestoneReached}
                  </div>
                )}
                {isTimeUp && (
                  <div className="timeout-popup">
                    <p>⏰ Time's up! You ran out of time.</p>
                    <button onClick={resetGame}>Try Again</button>
                  </div>
                )}
              </main>
            } />
            
            <Route path="/about" element={<About />} />
          </Routes>
        </Container>
      </Router>
    )
}
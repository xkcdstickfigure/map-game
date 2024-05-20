import { useEffect, useState } from "react"
import { GameContext } from "./context.js"
import { Map } from "./Map.jsx"
import names from "./names.json"
import ConfettiExplosion from "react-confetti-explosion"

const MAX_COUNTRIES = 197
const TIME = 15 * 60

export const App = () => {
    const [completedCountries, setCompletedCountries] = useState([])
    const [countdown, setCountdown] = useState(TIME)
    const [started, setStarted] = useState(false)
    const [ended, setEnded] = useState(false)
    useEffect(() => {
        if (started && !ended) {
            const interval = setInterval(() => {
                setCountdown(t => {
                    if (t <= 1) {
                        clearInterval(interval)
                        setEnded(true)
                    }
                    return t - 1
                })
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [started, ended])

    const onInput = e => {
        const value = e.target.value.toLowerCase().trim()
        const code = names[value]
        if (code && !completedCountries.includes(code)) {
            setCompletedCountries([...completedCountries, code])
            e.target.value = ""
            if (completedCountries.length + 1 >= MAX_COUNTRIES) setEnded(true)
        }
        if (!started) setStarted(true)
    }

    return (
        <GameContext.Provider value={{ completedCountries }}>
            <div className="max-w-7xl mx-auto text-4xl px-8">
                <div className="flex flex-grow justify-between mt-12 mb-4">
                    <p className="w-48 text-neutral-400">{formatTime(countdown)}</p>

                    {!ended ? (
                        <input
                            autoFocus={true}
                            className="bg-transparent outline-none text-white text-center placeholder-neutral-600"
                            onInput={onInput}
                            placeholder="Type here"
                        />
                    ) : completedCountries.length >= MAX_COUNTRIES && (
                        <ConfettiExplosion />
                    )}

                    <p className="w-48 text-neutral-400 text-right whitespace-nowrap"><span className="text-white">{completedCountries.length}</span> / {MAX_COUNTRIES}</p>
                </div>

                <Map />
            </div>
        </GameContext.Provider>
    )
}

const formatTime = t => {
    const minutes = (Math.floor(t / 60)).toString().padStart(2, "0")
    const seconds = (t - minutes * 60).toString().padStart(2, "0")
    return `${minutes}:${seconds}`
}
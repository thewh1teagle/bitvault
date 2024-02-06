import {useState, useEffect} from 'react'

type TMode = 'dark' | 'light'

function systemMode(): TMode {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
    }
    return 'light'
}


export default function useDarkMode() {
    const initMode = localStorage.getItem('color') as TMode  ?? systemMode()

    const [mode, setMode] = useState<TMode>(initMode)

    useEffect(() => {
        localStorage.setItem('color', mode)
        document.body.classList.remove('dark')
        document.body.classList.remove('light')
        document.body.classList.add(mode)
    }, [mode])

    return {mode, setMode}
}
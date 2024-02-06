import useDarkMode from "../hooks/useDarkMode"
import {BsSun} from 'react-icons/bs'
import {BiMoon} from 'react-icons/bi'

export default function DarkModeToggle() {
    const { mode, setMode } = useDarkMode()

    function onToggle() {
        setMode(mode === 'dark' ? 'light' : 'dark')
    }
    return (
        <div className="relative outline-1">
            
            <label className="relative inline-flex items-center cursor-pointer">
            {mode === 'dark' && <BsSun className='absolute text-white z-10 right-1 text-xs dark:text-gray-700' style={{}} />}
            {mode === 'light' && <BiMoon className='absolute text-white z-10 left-1 text-xs dark:text-gray-700' style={{}} />}
                <input
                    checked={mode === 'light'}
                    onChange={onToggle}
                    type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-white   peer-focus:outline-none  dark:peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-700 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
            </label>
        </div>
    )
}
import { useState, useRef } from "react"
import { useLocalStorage } from "usehooks-ts"

import { Vault, decryptData, parseData } from "../utils/bitwarden"
interface IJSON {
    [key: string]: string
  }
  
  

  export default function OpenVault({setVault}: {setVault: (arg: Vault) => void}) {
    const [password, setPassword] = useState('')
    const passwordRef = useRef<HTMLInputElement>(null)
    const [enc, setEnc] = useLocalStorage<IJSON | null>('enc', null)
    const [filename, setFilename] = useLocalStorage<string | undefined>('filename', undefined)
    // const [filename, setFilename] = useState(undefined)
    const [incorrect, setIncorrect] = useState(false)
  
    function onChange(event: any) {
      readFile(event.target.files?.[0])
    }
  
    async function readFile(file: File) {
      setFilename(file.name)
      const reader = new FileReader()
      const data = await new Promise(resolve => {
        reader.addEventListener('load', event => {
          resolve(event?.target?.result as string ?? '')
        })
        reader.readAsText(file)
      }) as string
      const jsonData = JSON.parse(data)
      setEnc(jsonData)
      setTimeout(() => passwordRef?.current?.focus(), 10)
  
    }
  
    function onDrop(event: any) {
      event.preventDefault()
      const file = event.dataTransfer?.items?.[0].getAsFile()
      if (file) {
        readFile(file)
      }
      
    }
  
    function onDragOver(event: any) {
      event.preventDefault()
    }
  
    async function onOpen() {
      setIncorrect(false)
      try {
        const clear = await decryptData(enc as IJSON, password)
        setVault(await parseData(clear))
      } catch {
        setIncorrect(true)
      }
  
  
    }
  
    return (
      <div className="flex flex-col items-center justify-center mt-5 w-[300px] m-auto fade-in" onDrop={onDrop} onDragOver={onDragOver} >
        {!filename && (
          <div className="text-sm p-2 dark:text-white">
          1. Export encrypted bitwarden json from <a className="text-blue-500" href="https://vault.bitwarden.com/#tools/export">bitwarden.com</a>
          <br/>
          2.Choose <code>.json</code> (Encrypted) format with Password protected option.<br />
          3. Now you have an offline vault!
          </div>
        )}

        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-200">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 h-[112px]">
  
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-3 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <div className='flex flex-row'>
              {!filename && (
                <>
                  <span className="ml-1 text-blue-500 underline">Select file</span>
                </>
              )
              }
              {filename && (
                <div className="flex flex-col">
                  <p className="text-gray-900">{filename.slice(0, 5) + '...' + filename.slice(-4)}</p>
                </div>
              )}
            </div>
  
            {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold"></span></p><span>browse</span> */}
          </div>
          <input accept="application/json" onChange={onChange} id="dropzone-file" type="file" className="hidden" />
        </label>
  
  
        <div className={`relative mb-1 mt-5 w-full`}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {/* <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 dark:text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
  
          </div>
          <input
  
            onKeyDown={e => e.key === 'Enter' ? onOpen() : null}
            onChange={e => setPassword(e.target.value)}
            disabled={!enc}                       
            ref={passwordRef} type="password" id="input-group-1"
            className="
                bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                    dark:focus:ring-blue-500 dark:focus:border-blue-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              "
  
            placeholder="Password"
          />
        </div>
        <p className={`text-center text-red-400 ${incorrect ? 'mb-4' : null} ${incorrect ? 'collapse-anim' : null} ${!incorrect ? 'opacity-0' : 'opacity-1'}`}>incorrect password</p>
        <button disabled={!enc} onClick={onOpen} type="button" className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">OPEN</button>
      </div>
    )
  }   
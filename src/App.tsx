import { useState } from "react"
import { Vault} from "./utils/bitwarden"
import DarkModeToggle from "./components/darkModeToggle"
import OpenVault from "./components/openVault"
import VaultComponent from "./components/Vault"



function App() {
  const [vault, setVault] = useState<Vault | null>()
  function onLock() {
    setVault(null)
  }

  return (
    <div className="app">
      <div className="absolute left-5 top-5">
        <DarkModeToggle />
      </div>
      <h1 className="text-center m-3 text-slate-700 font-normal pt-5 text-5xl dark:text-white">warden</h1>
      {!vault && <OpenVault setVault={setVault} />}
      {vault && <VaultComponent vault={vault} onLock={onLock} />}
    </div>
  )
}

export default App

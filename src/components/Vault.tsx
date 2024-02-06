import { useEffect, useState } from "react"
import { Vault, VaultItem } from "../utils/bitwarden"
import { BiLockAlt } from 'react-icons/bi'
import { MdOutlineSearch } from 'react-icons/md'
import VaultItemComponent from "./VaultItem"
import ItemsList from "./ItemsList"

export default function VaultComponent({ vault, onLock }: { vault: Vault, onLock: VoidFunction }) {
    const [filterValue, setFilterValue] = useState('')
    const [folderId, setFolderId] = useState('all')
    const [item, setItem] = useState<VaultItem | null>()

    function saveScroll() {
        // Save the current scroll position in sessionStorage
        window.sessionStorage.setItem('scrollPosition', String(window.scrollY));
    }


    useEffect(() => {
        function restoreScroll() {
            if (item) return
            // Retrieve the saved scroll position from sessionStorage
            const scrollPosition = window.sessionStorage.getItem('scrollPosition');
            if (scrollPosition !== null) {
                // Convert the stored position to a number and scroll to that position
                window.scrollTo(0, parseInt(scrollPosition, 10));
            }
        }
        if (item) return
        restoreScroll()
    }, [item])

    let items = vault.items
    if (folderId !== 'all') {
        items = items.filter(item => item.folderId === folderId)
    }
    if (filterValue) {
        items = items.filter(item => item.name.includes(filterValue))
    }

    if (item) {
        return <VaultItemComponent item={item} onCancel={() => setItem(null)} />
    }

    function onSelectChange(event: any) {
        setFolderId(event.target.value)
    }

    return (
        <div className="flex flex-col w-full items-center fade-in">
            <div className="flex flex-col w-80">
                <div className="flex flex-row w-full gap-2 items-center pb-3">
                    <select value={folderId} onChange={onSelectChange} id="small" className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value='all'>All</option>
                        {
                            vault.folders.map(folder => (
                                <option key={folder.id} value={folder.id}>{folder.name}</option>
                            ))
                        }
                    </select>
                    <BiLockAlt className='text-2xl cursor-pointer dark:text-white' onClick={onLock} />
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MdOutlineSearch className='text-2xl text-gray-400' />
                    </div>
                    <input
                        ref={r => r?.focus()}
                        onChange={event => setFilterValue(event.target.value)}
                        type="text"
                        id="input-group-1"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search"
                        value={filterValue}
                        onKeyDown={event => event.key === 'Enter' ? null : null}
                    />
                </div>

                <ItemsList items={items} setItem={(item) => {
                    saveScroll()
                    setItem(item)
                }} />
            </div>
        </div>
    )
}

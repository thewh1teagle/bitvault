import { useState } from "react"
import { VaultItem } from "../utils/bitwarden"
import CopyInput from "./CopyInput"



function NoteItem({ item, onCancel }: { item: VaultItem, onCancel: VoidFunction }) {
    const [copied, setCopied] = useState(false)

    function onCopy() {
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
        navigator.clipboard.writeText(item.notes as string)
    }
    return (
        <div className="flex flex-col w-full items-center mb-5 fade-in">
            <div className="flex flex-col md:w-[500px] sm:w-[95vw] mt-5 items-center">
                <span className="text-blue-500 text-2xl text-center font-normal">{item.name}</span>
                {!copied ?
                    <svg onClick={onCopy} className="cursor-pointer w-6 h-6 mt-5 text-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.53334 13.5668C0.53334 14.1768 0.775661 14.7618 1.20699 15.1931C1.63833 15.6245 2.22334 15.8668 2.83334 15.8668H5.13334V14.3334H2.83334C2.63001 14.3334 2.435 14.2527 2.29123 14.1089C2.14745 13.9651 2.06667 13.7701 2.06667 13.5668V2.83345C2.06667 2.63011 2.14745 2.43511 2.29123 2.29133C2.435 2.14755 2.63001 2.06678 2.83334 2.06678H13.5667C13.77 2.06678 13.965 2.14755 14.1088 2.29133C14.2526 2.43511 14.3333 2.63011 14.3333 2.83345V5.13345H7.43334C6.82334 5.13345 6.23833 5.37577 5.80699 5.8071C5.37566 6.23843 5.13334 6.82345 5.13334 7.43345V18.1668C5.13334 18.7768 5.37566 19.3618 5.80699 19.7931C6.23833 20.2245 6.82334 20.4668 7.43334 20.4668H18.1667C18.7767 20.4668 19.3617 20.2245 19.793 19.7931C20.2244 19.3618 20.4667 18.7768 20.4667 18.1668V7.43345C20.4667 6.82345 20.2244 6.23843 19.793 5.8071C19.3617 5.37577 18.7767 5.13345 18.1667 5.13345H15.8667V2.83345C15.8667 2.22345 15.6244 1.63844 15.193 1.2071C14.7617 0.775768 14.1767 0.533447 13.5667 0.533447H2.83334C2.22334 0.533447 1.63833 0.775768 1.20699 1.2071C0.775661 1.63844 0.53334 2.22345 0.53334 2.83345V13.5668ZM6.66667 7.43345C6.66667 7.23011 6.74745 7.03511 6.89123 6.89133C7.035 6.74755 7.23001 6.66678 7.43334 6.66678H18.1667C18.37 6.66678 18.565 6.74755 18.7088 6.89133C18.8526 7.03511 18.9333 7.23011 18.9333 7.43345V18.1668C18.9333 18.3701 18.8526 18.5651 18.7088 18.7089C18.565 18.8527 18.37 18.9334 18.1667 18.9334H7.43334C7.23001 18.9334 7.035 18.8527 6.89123 18.7089C6.74745 18.5651 6.66667 18.3701 6.66667 18.1668V7.43345Z" fill="#6E6B6B" />
                    </svg>
                    :
                    <svg className="w-6 h-6 mt-5 text-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M17.3825 0.223431C18.013 0.638022 18.1897 1.48694 17.7773 2.12089L8.50534 16.3793C8.3973 16.5454 8.25468 16.686 8.08733 16.7913C7.91998 16.8965 7.73188 16.964 7.53605 16.9891C7.34022 17.0141 7.14131 16.9961 6.95308 16.9362C6.76486 16.8764 6.5918 16.7762 6.44586 16.6425L0.446326 11.1585C0.178719 10.9139 0.0187254 10.5724 0.00154158 10.2091C-0.0156422 9.84588 0.111391 9.49064 0.354697 9.22157C0.598002 8.9525 0.937648 8.79163 1.29892 8.77435C1.66019 8.75707 2.01349 8.8848 2.28109 9.12944L7.09817 13.532L15.4953 0.620473C15.6933 0.316252 16.0033 0.103525 16.3571 0.0290689C16.711 -0.0453869 17.0798 0.024525 17.3825 0.223431Z" fill="#0DD439" />
                    </svg>
                }


                <textarea disabled className="w-full h-[300px] p-5 text-gray-800 bg-gray-300 text-lg rounded-lg mt-5" value={item.notes} />
                {/* <div className="flex flex-col mt-9 items-center relative h-[350px] w-[600px] m-auto border border-red-400 border-spacing-1 m-auto">
                    <button>hello</button>
                    
                </div> */}
                <button onClick={onCancel} type="button" className="w-full mt-8 text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>
            </div>
        </div>
    )
}


function CardItem({ item, onCancel }: { item: VaultItem, onCancel: VoidFunction }) {
    return (
        <div className="flex flex-col w-full items-center fade-in">
            <div className="flex flex-col w-80 mt-10">
                <span className="text-blue-500 text-2xl text-center font-normal">{item.name}</span>
                <div className="flex flex-col mt-9">
                    <CopyInput label="Name" value={item.card?.cardHolderName ?? 'n/a'} />
                    <CopyInput label="Number" value={item.card?.number ?? 'n/a'} />
                    <CopyInput label="Expiration Date" value={item.card?.expMonth + '/' + item.card?.expYear} />
                    <CopyInput label="Code" value={item.card?.code ?? 'n/a'} />
                </div>
                <button onClick={onCancel} type="button" className="mt-8 text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>

            </div>
        </div>
    )
}

function LoginItem({ item, onCancel }: { item: VaultItem, onCancel: VoidFunction }) {
    return (
        <div className="flex flex-col w-full items-center fade-in">
            <div className="flex flex-col w-80 mt-10">
                <span className="text-blue-500 text-2xl text-center font-normal">{item.name}</span>
                <div className="flex flex-col mt-9">
                    <CopyInput label="Username" value={item.login?.username ?? 'n/a'} />
                    <CopyInput label="Username" value={item.login?.password ?? 'n/a'} />
                </div>
                <button onClick={onCancel} type="button" className="mt-8 text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>

            </div>
        </div>
    )
}


export default function VaultItemComponent({ item, onCancel }: { item: VaultItem, onCancel: VoidFunction }) {
    if (item.login) {
        return <LoginItem onCancel={onCancel} item={item} />
    }

    if (item.card) {
        return <CardItem onCancel={onCancel} item={item} />
    }
    if (item.notes) {
        return <NoteItem onCancel={onCancel} item={item} />
    }
    return <button onClick={onCancel} type="button" className="mt-8 text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>
}
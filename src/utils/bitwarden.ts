interface IJSON {
    [key: string]: string
}

export interface VaultItem {
    id: string
    folderId: string
    name: string
    login?: {
        username: string
        password: string
        uris: {
            uri: string
        }[]
    },
    notes?: string,
    card?: {
        cardHolderName: string,
        brand: string,
        number: string,
        expMonth: string,
        expYear: string,
        code: string
    }

}

interface VaultFolder {
    id: string
    name: string
}

export interface Vault {
    encrypted: boolean
    folders: VaultFolder[]
    items: VaultItem[]
}

async function hmac(value: ArrayBufferLike, key: ArrayBufferLike, algorithm: string) {
    const signingAlgorithm = {
        name: "HMAC",
        hash: { name: toWebCryptoAlgorithm(algorithm) }
    }

    const impKey = await window.crypto.subtle.importKey(
        "raw",
        key,
        signingAlgorithm,
        false,
        ["sign"]
    )
    return await window.crypto.subtle.sign(signingAlgorithm, impKey, value)
}

async function aesDecrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer) {
    const impKey = await window.crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    )
    return await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv: iv },
        impKey,
        data
    )
}

async function hkdfExpand(prk: ArrayBuffer, info: string, outputByteSize: number, algorithm: string) {
    const hashLen = algorithm === "sha256" ? 32 : 64
    if (outputByteSize > 255 * hashLen) {
        throw new Error("outputByteSize is too large.")
    }
    const prkArr = new Uint8Array(prk)
    if (prkArr.length < hashLen) {
        throw new Error("prk is too small.")
    }
    const infoBuf = toBuf(info)
    const infoArr = new Uint8Array(infoBuf)
    let runningOkmLength = 0
    let previousT = new Uint8Array(0)
    const n = Math.ceil(outputByteSize / hashLen)
    const okm = new Uint8Array(n * hashLen)
    for (let i = 0; i < n; i++) {
        const t = new Uint8Array(previousT.length + infoArr.length + 1)
        t.set(previousT)
        t.set(infoArr, previousT.length)
        t.set([i + 1], t.length - 1)
        previousT = new Uint8Array(await hmac(t.buffer, prk, algorithm))
        okm.set(previousT, runningOkmLength)
        runningOkmLength += previousT.length
        if (runningOkmLength >= outputByteSize) {
            break
        }
    }
    return okm.slice(0, outputByteSize).buffer
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function decryptCipherString(data: string, key: ArrayBuffer, _macKey: ArrayBuffer) {
    const parts = data
        .split(".")[1]
        .split("|")
        .slice(0, 3)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [iv, cipherText, _mac] = parts.map(part => base64ToArrayBuffer(part))
    
    const clear = await aesDecrypt(cipherText, iv, key)
    return new TextDecoder().decode(clear)
}



function fromUtf8ToArray(str: string) {
    const strUtf8 = unescape(encodeURIComponent(str))
    const arr = new Uint8Array(strUtf8.length)
    for (let i = 0; i < strUtf8.length; i++) {
        arr[i] = strUtf8.charCodeAt(i)
    }
    return arr
}

function base64ToArrayBuffer(base64: string) {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
}

function toBuf(value: string) {
    let buf
    if (typeof value === "string") {
        buf = fromUtf8ToArray(value).buffer
    } else {
        buf = value
    }
    return buf
}

function toWebCryptoAlgorithm(algorithm: string) {
    if (algorithm === "md5") {
        throw new Error("MD5 is not supported in WebCrypto.")
    }
    return algorithm === "sha1"
        ? "SHA-1"
        : algorithm === "sha256"
            ? "SHA-256"
            : "SHA-512"
}

async function pbkdf2(password: string, salt: string, algorithm: string, iterations: number) {
    const wcLen = algorithm === "sha256" ? 256 : 512
    const passwordBuf = toBuf(password)
    const saltBuf = toBuf(salt)

    const pbkdf2Params = {
        name: "PBKDF2",
        salt: saltBuf,
        iterations: iterations,
        hash: { name: toWebCryptoAlgorithm(algorithm) }
    }

    const impKey = await window.crypto.subtle.importKey(
        "raw",
        passwordBuf,
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    )
    return await window.crypto.subtle.deriveBits(pbkdf2Params, impKey, wcLen)
}



export async function decryptData(data: IJSON, password: string) {
    const salt = data["salt"]
    const kdfIterations = Number(data["kdfIterations"])
    const encData = data["data"]
    const master = await pbkdf2(password, salt, "sha256", kdfIterations)
    const stretchedKey = await hkdfExpand(master, "enc", 32, "sha256")
    
    const stretchedMacKey = await hkdfExpand(master, "mac", 32, "sha256")
    return await decryptCipherString(encData, stretchedKey, stretchedMacKey)
}

export async function parseData(data: string) {
    return JSON.parse(data) as Vault
}


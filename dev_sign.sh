# Arguments
cd "$(dirname "$0")" || exit
if [ -z "$1" ]; then
    echo "Usage: $(basename "$0") <password>"
    exit 1
fi

# Config
password="$1"
keypath="$(pwd)/.tauri/upload-keystore.jks"
properties_path="$(pwd)/src-tauri/gen/android/key.properties"

# Create folders
mkdir -p .tauri

# Create key
if [ ! -f $keypath ]; then
    keytool -genkey -noprompt -v -keystore $keypath -keypass $password -storepass $password -keyalg RSA -keysize 2048 -validity 10000 -alias upload -dname "CN=mqttserver.ibm.com, OU=ID, O=IBM, L=Hursley, S=Hants, C=GB"
fi

echo "storePassword=$password
keyPassword=$password
keyAlias=upload
storeFile=$keypath" > "$properties_path"
echo "Created key in $keypath"
echo "Created properties in $properties_path"
echo "Now follow https://next--tauri.netlify.app/next/guides/distribution/sign-android/"
echo "And then"
echo "npm run tauri android build"


echo "Btw maybe you will need"
echo "import java.util.Properties"
echo "import java.io.FileInputStream"


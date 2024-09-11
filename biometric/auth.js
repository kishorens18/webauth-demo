async function createCredential() {
    const publicKey = {
        challenge: new Uint8Array([1]),
        rp: {
            name: "Your WebAuthn Demo"
        },
        user: {
            id: new Uint8Array([1]),
            name: "username",
            displayName: "User Name"
        },
        pubKeyCredParams: [
            {
                type: "public-key",
                alg: -7  // "ES256" IANA COSE Algorithms registry
            }
        ]
    };

    try {
        const credential = await navigator.credentials.create({ publicKey });
        console.log('Credential created:', credential);

        // Store credential ID and public key in localStorage for reuse
        localStorage.setItem('credentialId', bufferToBase64(credential.rawId));
        localStorage.setItem('publicKey', bufferToBase64(credential.response.getPublicKey()));  // Store public key in base64
        alert('Credential created and stored!');
    } catch (err) {
        console.error('Error creating credential:', err);
        alert('Error creating credential!');
    }
}

async function authenticateUser() {
    console.log("Authenticate called");

    const storedCredentialId = localStorage.getItem('credentialId');
    if (!storedCredentialId) {
        alert('No credential found. Please register first.');
        createCredential();
        return;
    }

    const publicKey = {
        challenge: new Uint8Array([2]),  // Should be randomly generated in real use
        allowCredentials: [{
            type: "public-key",
            id: base64ToBuffer(storedCredentialId)
        }]
    };

    try {
        const assertion = await navigator.credentials.get({ publicKey });
        console.log('Signature received:', assertion);
        alert('Signature verified!');
    } catch (err) {
        console.error('Error getting signature:', err);
        alert('Error getting signature!');
    }
}

// Helper function to convert base64 to Uint8Array
function base64ToBuffer(base64) {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
}

// Helper function to convert Uint8Array to base64
function bufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
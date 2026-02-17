import base64
import binascii

hash="49e6hSldHRaiYX329+ZjBSf/Lx67XEOz9uxhSBHtGU+YBzWF"


def decoder(hash):
    decoded = base64.b64decode(hash)
    salt = decoded[:4]
    hashedpassword = decoded[4:]
    
    print(f"Salt is:{binascii.hexlify(salt).decode()}")
    print(f"Hash is:{binascii.hexlify(hashedpassword).decode()}")

decoder(hash)
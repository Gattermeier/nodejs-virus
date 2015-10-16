# Node.js Virus
This is a Node.js 'Proof of Concept' Virus, it runs only in node and attempts to infect other node applications.

## Word or caution:

If you run the virus, it likely will do its job and .. infect you :) 
Also, it could break stuff.

## What it does:

For details how the virus works, read the comments in the source, but here what the virus does on a high level:

* It scans directories for package.json files and analyzes them for ‘entry points’
* It then checks if those files can be infected (eg: no already infected files)
* It attempts to append itself to the file (and even chmods if necessary)

# Elegy Engine: The Website™

This is the website for [Elegy Engine](https://github.com/ElegyEngine), and it's going to host a little blog, tutorials and other documentation.

## The Web Technology™

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator, and the API reference is built using [DocFx](https://dotnet.github.io/docfx/).

## How to build!

Prerequisites:
* .NET 8 or newer
* DocFx - [DocFx Quick Start](https://dotnet.github.io/docfx/)  
	```
	dotnet tool update -g docfx
	```
* npm - [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Build instructions:
1. Generate the API reference:  
	```
	docfx fx/docfx.json
	```
	This will produce a ton of YAML files in `fx/`, and then generate HTML into `static/ref/`. The `static` directory is used by Docusaurus for raw content that it will not filter and just copy to the website.
2. Generate the website:  
	```
	npm run start
	```
	This will process everything inside `blog/`, `docs/` and `src/`, and host the website at `localhost:3000`.
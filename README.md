# Alloybot Core
## Powerful and Versatile Module Loader

### Focus and Motivation
The main issue in the developer community for damn near anything, is that if you want a bot that does something specific, you would need to code the bot yourself or have someone who knows what they are doing code it from scratch. Even then there aren't many bots out there that do a whole lot. There are bots made for general use cases, but thats about as far as it goes for the general public.

The motivation for this is to have a product that is easy to add functionality to, and anyone can make a module for it and publish it for anyone else to use as well.

### Installing a module
Easy as 1,2,3.
1. Download the desired module.
2. Drop the module into the modules folder.
3. Start Alloybot.

Lets be honest though. It will not be that easy all the time. With the modularity of Alloybot, lots of configuration is left to the user and module developer.

For example, someone has made a module that adds the ability to connect and use IRC for interaction with Twitch Chat.
3 steps will not be that easy. The user who is adding the module will have to see if they need anything for that module since its connecting to an external service.
They will need to install the module, and the required authentication details for the bot to connect to Twitch.

There can be some modules that do not need any configuration. Such as a Discord Greeter. Maybe there will be an option to change the greeting, but it is optional. The user can install the Greeter module and start Alloybot.
Considering they already have a module that adds Discord connectivity and its configured.

### Creating a module
The bot is written in Javascript with the use of NodeJS.
Language options are extensive. Any languages other than JS would need the module entry file to be in JS.

- Typescript using [typescript](https://www.npmjs.com/package/typescript)
- GO using [node-go-require](https://www.npmjs.com/package/node-go-require)
- Python using [python-bridge](https://www.npmjs.com/package/python-bridge)
- C and C++ using [N-API](https://nodejs.org/api/n-api.html)
- Haskell using [haskell](https://www.npmjs.com/package/require-haskell)
- Java using [java](https://www.npmjs.com/package/java)
- Solidity using [solidity-to-abi](https://www.npmjs.com/package/solidity-to-abi)
- Plenty more where that came from.

On top of there being lots of language support, NodeJS is crossplatform. Anyone on any system with near any language can make Alloybot do anything. 
Anything is used loosely since there are some amazing people out there with unique skillsets, that it would not surprise me if someone made a module for Alloybot that would control their smart home products from Discord or Twitch Chat.

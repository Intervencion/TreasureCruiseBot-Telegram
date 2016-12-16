REQUIREMENTS:

openssl
node
npm (bundled with node)
pm2 (npm install pm2)
static hostname
port forwarding (8443)
SSL cert (script included)

==========================

PREREQUISITES

1. Create a bot with @botfather (this will be your development-branch, it doesn't matter what you call it)
2. Enter it's token in token/gem-dev.json, don't touch the rest just yet

==========================

INSTALLATION & START

1. install node and openssl
    > apt-get blah blah
2. use npm to install pm2 globally
    > sudo npm install -g pm2
3. edit cert/generate_key.sh with your information
4. execute it (creates two files, leave them where they are)
    > chmod +x generate_key.sh
    > bash generate_key.sh

5. enable port forwarding on port 8443

6. use pm2 to launch the server+bot (and keep it alive)
    > pm2 start app.json

If you want pm2 to automatically restart itself and the bot on Ubuntu reboot use following commands once:
    > pm2 save
    > pm2 startup

==========================

When everything works correctly and the bot responds, we can start deleting my bot to free the name for you to take.

After that you can edit token/gem.json and 'server.js' to include your token and to add gem to the list of executed bots (see line 18 in server.js).
After that you can use /reload to reload the server and start both bots.
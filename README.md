# Kickbase Autodecline
This is an node-express server coupled with node-schedule in order to hourly decline too low offers in the fantasy football game Kickbase.

## Settings
Settings can be changed in src/settings.ts.

### Kickbase Credentials
Your Kickbase username and passwort should be set in an environment variable on your host.

### Defaults
Default is to pull every player from market who has no offer higher than the **offer threshold** = 0.6 percent. 

**Declines** are run every full hour between 23:00 and 20:00 in timezone 'Europe/Berlin'.

Two minutes after every full hour all players which are currently not on market are put there.

## Deployment
You can deploy the app for instance here: 

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&name=kickbase-autodeclinetest&repository=github.com/eLindros/kickbase-autodecline&branch=main&run_command=npm%run%start&build_command=npm%run%build&ports=8080&env[KICKBASE_USER]=&env[KICKBASE_PASSWORD]=&env[OFFER_THRESHOLD]=0.6)

Or your provide of choice.

## Credits
Ronny Klein ([Buy Me A Coffee](https://www.buymeacoffee.com/kleindev), github: [@elindros](https://github.com/eLindros)).

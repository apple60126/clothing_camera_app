# Developing a web app that uses an accelerometer to consistently take quality pictures 

# Architecture
![Image](https://github.com/apple60126/clothing_camera_app/assets/45498246/f1366bb1-a19c-4920-8c08-d0193e78b9af)

# How to install
Install node on your computer. https://nodejs.org/en/download

Check it's installed by opening a terminal, and typing `node --version`. It should say something like v21.6.2 (or another version like that) 

Install ngrok. Ngrok is used so that you can view the app on your phone with a URL with https://. You can download it here: https://ngrok.com/

Once it's installed, check it installed by opening a terminal and typing `ngrok --help`. It should say something.

Download the repo to your computer via git clone 

# How to run the code

Open a terminal, and cd into the folder where you downloaded the repository, with `cd <the path of the folder you downloaded>`

Then in the same terminal, run `npm start`

In another separate terminal, do `ngrok http localhost:3000`. It will give you a link like "Forwarding https://aa4a-207-180-130-42.ngrok-free.app -> http://localhost:3000". You can use this https link on your phone and the app will run. But you must have run `npm start` above first in another terminal.

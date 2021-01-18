# Fineract's
🏥 Hack The North 2020++ Entry - Excercise with your friends live for a more fun and interactive excercise!

> 🏆 Fineract won **Azure Champ Prize - Hack for Good** At Hack the North!

> ⚠️ This is a Hackathon entry for Hack The North, and was created in under 36 hours. The code in this repo is likely to be hacky and potentially unstable/insecure, so please be careful if forking this repo. [You can view the project's Devpost page here.](https://devpost.com/software/fineract)

Team Members: Youssef Soliman, Michael Xu, Iyad Okal, Jordan Ruetz

## Dev

- Run `yarn get` in the base directory to get all the dependencies
- Run `yarn dev` in the base directory to run the dev environment

## Production

- Run `yarn build` in the client directory to build the react project
- Run `yarn start` in the base directory to deploy the app for production (this also runs `yarn build`)


## Inspiration
This project was inspired by a viral Tik-Tok video that we saw where a user controls a flappy bird using his nose.  We realized that there was great potential in this idea.  Millions of people were motivated by the gamification of exercise and with many people stuck at home without access to a gym, there is no better time to make working out at home fun!

## What it does
Fineract is a web app that helps you stay fit through playing games where you control the character’s motions through your body.  There are multiple games on the platform!  

Game #1:
Play Flappy Bird!  Control the bird by using the height of your head during a pushup.  When you go down, the bird goes down.  When you push up, the bird goes up.  You can even challenge a friend to a head-to-head battle, to see who's arms can last the longest, with video chatting (trash talking) live available.

Game #2:
Play the Dino Game!  Inspired by the chrome no internet game, you can jump over cacti and duck under birds.  This time, you must physically jump and your dino will hurdle the cactus.  Do a squat and your character will duck under the bird!

Additionally, you can pause, restart and exit the game using simple hand gestures.

## How we built it
We used [Posenet](https://github.com/tensorflow/tfjs-models/tree/master/posenet) in order to detect key body parts of the person in the video and then analyzed how the key points were changing in order to detect which gesture or action the person was performing.  On the frontend, we used JavaScript, Bootstrap and React to build out the website and translate the gestures we had detected into actions in the game. For the backend, we used Socket.io to handle the multiplayer connections for the games running smoothly with over 200 requests per second at a given moment.


## Challenges we ran into
A key obstacle that we faced—and thankfully, eventually overcame—was designing the user experience for our platform. With each member coming from a unique background, our team was overflowing with ideas on how our product should look and feel. Initially, it was difficult to decide whether we wanted a simple, lightweight platform or one that was more feature-rich. In making this decision, we consulted our favourite and least favourite apps to gain an understanding of what our final product could eventually look like. In the end, we came to a consensus to prioritize making the app accessible to all individuals. For this reason, we decided to make two different games: the infamous _flappy bird_ and the classic Google Chrome dino game. By first integrating two very well known games, we were able to make the learning curve for our UI as shallow as possible.
Another very important challenge we ran into was the limitations of our physical strength. Our quads were sore; arms were heavy. Unlike most hackathon developers, we were out and about the entire weekend!

## Accomplishments that we're proud of
With over 20,000 lines of code and 100+ commits, we are very proud of the final product we managed to produce in such a short amount of time. Our team took on the challenge of implementing very ambitious modules and ended up successful while we were at it. 

## What we learned
Every single team member walked away from this project with a great deal of knowledge in many different technological disciplines. We learned how to use and handle canvases in React, implement TensorFlow.js to detect the position of a human through a webcam, and build a stable multiplier game using WebSockets.

## What's next for Fineract
Fineract aspires to become the goto fitness app for anyone looking for a fun and engaging platform to improve their fitness. To expand our reach to a broader audience, we seek to target the specific needs of individuals. More specifically, our future plans include:
Creating even more games tailored towards exercising a particular muscle group
Adding various difficulty levels so that anyone—ranging from elite athletes to toddlers—can achieve their fitness goals on Fineract
Embedding more refined peer-to-peer interaction features to bring endless socialization to every workout
All in all, we hope to bring more timeless games to the platform to make working out not only about the body, but the mind as well.

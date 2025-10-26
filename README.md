# webapp-falling

## A bit about this game

Basically, the user will be an operator in the ISS, they gotta control the ISS s that it does not fall into the earth, while making sure that it does not go too far and freeze the control. 

## Tech Stack

- HTML: `index.html`
- CSS: `styles.css`
- JavaScript (vanilla ES6): `scripts/`
- three.js: 3D rendering (used for scene and object paths)


## Things I wanna have:

* Add a slow rotating background, so that it looks a little bit more realistic?
* Add a hull integrety bar
    * slowly desentigrates as it goes too hot or too cold very fast
* 3 trillion billion ice cream chips worth of bottles

## Devlogs

* 21 Oct 2025
     Updated the base files and added an external library
    * Created camera and set up the basic scene for the ISS and earth view
    * Used NASA image of earth as wrapper
    * ISS is just a blob for now
* 22 Oct 2025
    * Created a little more detailed ISS, not a blob anymore
        * Has solar panels (4) and different modules (2)
        * Will probably change it if needed in the future
    * ISS will slowly fall downwards, and burn up in the atmosphere
    * Added a "ring" like atmosphere, will search up how to have it be a gradient or something instead considering it looks rather un-natural
    * Added a HUD kinda bar, should basicallly show the distance from earth to ISS
        * Green is perfect distance
        * Red is too close to earth, burn up
        * Blue is too far from earth, freeze up
    * Rotated ISS a bit
* 23 Oct 2025
    * Changed scale of ISS and earth
        * Should look more realistic now
    * Made it so that the camera placement is always a specific distance from ISS
    * Added a terminal "console" thingy
    * Added path mechanics (really basic fr)
* 24 Oct 2025
    * Trying to add terminal bar
        * not doing it, nope
    * Pressing space bar pushes ISS farther into the endless void of space
        * Was having some issues where if the ISS went to burn start, then it would stay in that state, ez fix (jus use weight blending)
        * If ISS goes too far from earth, 0.70u, it starts to freeze over and the controls lock
    * Terminal text does't overflow now
    * Added phase 4
        * altitude remains locked until phase 4 ends
        * Fuel bar shows up
        * longer you press it, the more fuel is used
* 26 Oct 2025
    * I tried really, really really hard to add those canisters
        * Literally couldn't get them to spawn in the ISS's orbit
        * They would even some times just throw a fucking error at me, why?
            * because I DONT KNOW HOW TO WORK WITH JS LIKE THIS!!!!!
        * I think I took too big of a project, should have probably started with a platformer or something like that before getting into the 3d stuff...
        * Added tech stack to readme
        * That's it I think, nothing new
        * Wait a minute... did I forget to add things to readme yesterday???????? bruh...
            * ignore that then

## A final thingyyyy

Vallkaie and ChefYeshpal are the same person (me), just that Valkarie was my linux system and I set up user.name on it literally yesterday, so pls dont be alarmed

Also, I had intended to add some more things into this project like having canisters that orbit around the earth on random altitudes but in a specific fixed path of the ISS, and the user's job would be to set the altitude so that they could refuel. However I for the life of me couldn't find out how to add that feature cause somehow I kept missing things or not being able to understand how to insert all that. 

Right now the basic functions like pressing space to move up, burning if too low in altitude, and freezing if too far works. I honestly dont have the will power to do anything else in this project cause I think I picked up something that's a bit too advanced for me. Not to mention that the entire reason why I'm doing siege is to learn JS...
# webapp-falling

{note to self: make sure to add a full tech stack explaining how you built your project}

## A bit about this game

Basically, the user will be the ISS controller, they gotta control stuff on the ISS. Will need to make a branching tree or something for choices and all. I'll make it up as we go

## TechStack
### Extenal libraries
* three.js
    * Used for building the scene and making object paths


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
    * 
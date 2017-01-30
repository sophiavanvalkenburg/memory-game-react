# Simple Memory Card Game

## Setup
Clone this repo and run `npm install`, then `npm run dev` to start up the development server. Once it’s running, you can view the app at `localhost:3000`.

## My Changes
The only additional package I added was `whatwg-fetch` for data fetching. 
Most changes were made in Game.js and Timer.js

## Required Features
The game should follow the basic rules of memory:
 * All cards begin face down.
 * The player turns one card face up, and then a second.
   * If they match, the pair is removed from the game.
   * If they do not match, both cards turn back over.
 * The game ends when the player finds all matching pairs.
 * Timer starts when the first card is flipped over and stops when the game ends.
 * Fetch card data from an external URL.

## Additional Features
I added the additional (not required) features:
 * Mismatches count in addition to timer.
 * "Replay" and "Level Up" buttons.

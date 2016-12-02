# NYT Games Team Web Code Test

Thank you for your interest in the NYT Games team! This exercise will help us get to know you a bit as an engineer. Your task is to create a playable version of the card-matching game Memory. Your app should fetch the game data found at this URL: https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json.


## Code Test Guidelines
The game should follow the basic rules of memory:
* All cards begin face down.
* The player turns one card face up, and then a second.
  * If they match, the pair is removed from the game.
  * If they do not match, both cards turn back over.
* The game ends when the player finds all matching pairs.

The only other requirement is that you incorporate the `Timer` component that we’ve included in the starter project. You may modify the component to better integrate with your app as a whole, but the timer should start when the first card is flipped over and should stop when the game ends. Beyond that, the sky’s the limit. All other application and interface design decisions are left to your discretion.

When reviewing your submission, the following criteria will be considered:
- **Overall code clarity and organization**: Does the app structure make sense? Are components broken down in a sensible way? Can we follow the control flow without a user manual?
- **State management**: Is the application state handled in an elegant way? Do the different pieces of state interact logically?
- **User experience**: Is the interface intuitive? How polished does it feel?

## Extra Credit
As long as your app satisfies everything in the previous section, you should feel comfortable skipping this section. But if you find yourself with some time left over, here are some suggestions on ways you might extend your app and really make it stand out:
- Save functionality to let the user exit and return mid-game
- A scoring system beyond time spent solving
- Additional modes of play (head-to-head, race-the-clock, etc.)
- A leaderboard to record top solves
- User-customizable card styles
- Game sounds (and maybe a way to mute them)
- Support for [three-card matches](https://web-code-test-dot-nyt-games-prd.appspot.com/triples.json)
- Any other enhancements you might dream up that would showcase your creativity

## Setup
To help you get started†, we’ve created this starter project based on [NYT kyt](https://github.com/NYTimes/kyt) that uses Webpack, Node, Babel, Express, React and Sass + CSS Modules, all of which are technologies we use internally. Feel free to extend the `package.json` with any other packages that you might want to extend the app’s functionality (for data fetching, state handling, etc.).

Clone this repo and run `npm install`, then `npm run dev` to start up the development server. Once it’s running, you can view the app at `localhost:3000`††.

If you’re looking for somewhere to start, a good place to dive in is `Game.js`, where we’ve left a placeholder `<div>` for your game. Good luck! We look forward to playing your game.

---

†You are welcome to use your own setup if you prefer, but be sure to track your changes through git either way. We are interested in your journey as well as your destination. When you're finished, please zip up the project folder and send it to the address provided in your invitation. Replace the contents of this Readme file with any special installation instructions or general comments about the app not specifically called out in your code.

††See the `scripts` in `package.json` for more commands you can run.

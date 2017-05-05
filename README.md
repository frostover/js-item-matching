# js-item-matching
Simple and dynamic item/card matching with HTML/CSS/JS

*[Live Example](https://frostover.github.io/js-item-matching/)*

## Features
Add a list of items that are identified by two values. Objects are created for both values and mixed together with all the other items. When you select two correct matches they are highlighted green.

## Requirements
- [jQuery](https://jquery.com/)

## Usage

### Create Array of Selections
You must create an initial array of Selections before the game can be rendered. Here is an example of a Selection array.
```
var items = [
	new Selection('Dog', 'perro'),
	new Selection('Cat', 'gato'),
	new Selection('Bird', 'pájaro'),
	new Selection('Horse', 'caballo');
];
```

### Start The Game
Once all the cards are created starting the game is farily easy.
```
var game = MatchingGame
	.init(items)
	.render();

```

### Events
You can listen to events to customize the game as needed

#### matchFailed (item1, item2)
Called when the user made an invalid selection.

#### matchmatchSuccess (item1, item2)
Called when the user made the correct selection (match).

#### matchComplete (incorrect, total)
Called when the game is over and there are no more selections.
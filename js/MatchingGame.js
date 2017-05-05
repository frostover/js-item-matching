var Selection = function(value1, value2) {
	this.value1 = value1;
	this.value2 = value2;
};

var Card = function(match, display, selection) {
	this.match = match;
	this.display = display;
	this.selection = selection;

	var matched = false;
};

var MatchingGame = {
	maxColumns: 4,
	container: '#matchingGame',
	debug: true,
	separated: true,
	/* Edit above this */
	columns	: 0,
	rows	: 0,
	isGameOver: false,
	cards: [],
	selected: undefined,
	incorrect: 0,
	correct: 0,

	/**
	* 	Setup the game. Selections must be passed
	*	@param {array of Selections} selections
	*	@returns Reference to self
	*/
	init: function(selections) {
		this.initClickHandler();
		this.createCards(selections);

		if(this.separated == false) {
			this.cards = this.shuffleCards(this.cards);
		}

		return this;
	},

	/**
	* 	Uses passed selections to determine the column
	*	and row count. Creates a new set of cards to be
	*	used for the game.
	*	
	*	@param {array of Selections} selections
	*	@returns Reference to self
	*/
	createCards: function(selections) {
		//Get total number of possible columns and rows for the item set
		var columns = Math.ceil(Math.sqrt(selections.length) * 2),
			rows 	= Math.ceil(selections.length / columns) * 2,
			count 	= 0;

		//Check if we need to constrain the columns
		if(this.maxColumns < columns) {
			columns = this.maxColumns;
			rows = Math.ceil(selections.length / columns) * 2;
		}

		//Create pairs of cards using the selection options
		if(this.separated) {
			var values1 = [], values2 = [];

			while(count < selections.length) {
				var card1 = new Card(count, selections[count].value1, selections[count]),
					card2 = new Card(count, selections[count].value2, selections[count]);

				values1.push(card1);
				values2.push(card2);
				count++;
			}

			values1 = this.shuffleCards(values1);
			values2 = this.shuffleCards(values2);

			this.cards = values1.concat(values2);
		} else {
			while(count < selections.length) {
				var card1 = new Card(count, selections[count].value1, selections[count]),
					card2 = new Card(count, selections[count].value2, selections[count]);

				this.cards.push(card1, card2);
				count++;
			}
		}

		//Set the column and row count
		this.columns = columns;
		this.rows = rows;

		if(this.debug) { console.log('Created %s items. %s Columns and %s Rows', count*2, columns, rows); }

		return this;
	},

	/**
	* 	Shuffle cards in a random order
	*	@returns Shuffled array
	*/
	shuffleCards: function(array) {
		for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
    	}

		return array;
	},

	/**
	* 	Initialize the click handler for list items
	*	@returns Reference to self
	*/
	initClickHandler: function() {
		var self = this;

		$(this.container).on('click', '.matching-card-item', function() {
			var clickedCard = self.cards[$(this).data('index')];

			//If it's already matched don't do anything
			if(clickedCard.matched || self.isGameOver) {
				self.selected = undefined;
				return;
			}

			//Compare the two
			if(self.selected !== undefined) {
				//If it's a correct match
				if(clickedCard.match == self.selected.match && clickedCard != self.selected) {
					$(this).addClass('correct');
					$('.card-' + self.cards.indexOf(self.selected))
						.removeClass('selected')
						.addClass('correct');

					//Set the cards to matched
					self.cards[self.cards.indexOf(self.selected)].matched = true;
					self.cards[self.cards.indexOf(clickedCard)].matched = true;

					//Trigger success event
					self.correct++;
					$(self).trigger('matchSuccess', [self.selected, clickedCard]);

					//Check if this is the last value
					if(self.correct == (self.cards.length)) {
						self.isGameOver = true;
						$(self).trigger('matchComplete', [self.incorrect, self.cards.length]);						
					}

					//Clear old values
					self.selected = undefined;
				} else {
					//Reset, no match
					$('.card-' + self.cards.indexOf(self.selected)).removeClass('selected');

					//Trigger failed event
					self.incorrect++;
					$(self).trigger('matchFailed', [self.selected, clickedCard]);

					self.selected = undefined;
				}
			} else {
				//This is first selection
				$(this).addClass('selected');
				self.selected = clickedCard;
			}

			if(self.debug) { console.log(clickedCard); }
		});

		return this;
	},

	/**
	* 	Sets the container to render the game
	*	@param {string} container
	*	@returns Reference to self
	*/
	setContainer: function(container) {
		this.container = container
		return this;
	},

	/**
	* 	Creates card elements
	*	@returns Reference to self
	*/
	render: function() {
		//Create the main list
		var ul 	  = $('<ul id="matching_game_list"></ul>'),
			width = 100 / this.columns;

		//Go through each card
		for (var i = 0; i < this.cards.length; i++) {
			//Create a list item and anchor to put inside it
			var li  = $('<li class="matching-card-item"></li>');

			//Set the index for the click handler
			li.attr('data-index', i);
			li.addClass('card-' + i);
			//Set the width based on the columns
			li.css('width', width + '%');
			//Add the display value to the anchor html
			li.html('<div class="matching-card-content">' + this.cards[i].display + '</div>');

			//Add the elements
			ul.append(li);
		}

		//Add the ul to the container
		$(this.container).append(ul);

		return this;
	}
};
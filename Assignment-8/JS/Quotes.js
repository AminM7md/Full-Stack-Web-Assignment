var ele = document.getElementById(QuoteId)
var Quotes = [
    {'author': 'Jim Rohn', 
     'quote': 'Beware of what you become in pursuit of what you want.'
    },
    {'author': 'Epictetus', 
     'quote': 'It\'s not what happens to you, but how you react to it that matters.'
    },
    {'author': 'Frank Sinatra', 
     'quote': 'The best revenge is massive success.'
    },
    {'author': 'Wayne Gretzy', 
     'quote': 'You miss 100% of the shots you don\'t take.'
    },
    {'author': 'Nelson Mandela', 
     'quote': 'Resentment is like drinking poison and waiting for your enemies to die.'
    },
    {'author': 'Elbert Hubbard', 
     'quote': 'Do not take life too seriously. You will not get out alive.'
    },
];

var box = ''

function Quote() {
    var ele = document.getElementById('QuoteId');
    var randomIndex = Math.floor(Math.random() * Quotes.length);
    var randomQuote = Quotes[randomIndex];
    var box = `
        <h1>Quote of the Day</h1>
        <p>Press the button below to receive a random quote!</p>

        <button onclick="Quote();">New Quote</button>
        <p>${randomQuote.quote}</p>
        <p>-- ${randomQuote.author}</p>
    `;
    ele.innerHTML = box;
}


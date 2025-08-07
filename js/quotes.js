// Quote API configuration
const QUOTES_BASE_URL = 'https://api.quotable.io/quotes/random';
const FALLBACK_QUOTE = {
    quote: "To me, there are three things we all should do every day. Number one is laugh. You should laugh every day. Number two is think. You should spend some time in thought. And number three is you should have your emotions moved to tears, could be happiness or joy. But think about it. If you laugh, you think and you cry, that's a full day. That's a heck of a day",
    author: "Jim Valvano"
};

// Fetch daily quote from Qutable IO
async function getDailyQuote() {
  try {
    const url = `${QUOTES_BASE_URL}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Quotable API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data[0]);

    return {
      quote: data[0].content,
      author: data[0].author
    }


  } catch (error) {
    console.error('Quote fetch error:', error);
    return {
      error: true,
      message: `Unable to retrieve random quote.`
    };
  }
}




// Main function to generate and display daily quote
async function generateQuoteDisplay() {
    try {
        // Try to fetch from API first
        const apiQuote = await getDailyQuote();

        console.log(apiQuote.quote);
        console.log(apiQuote.author);
        
        
    } catch (error) {
        console.error('Error in generateQuoteDisplay:', error);
        // Ensure fallback is always shown
        updateQuoteDisplay(FALLBACK_QUOTE);
    }
}

// Optional: Refresh quote function for manual refresh
function refreshQuote() {
    generateQuoteDisplay();
}
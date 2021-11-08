import React from "react"
import { PRICING_SYMBOLS } from "../../util/pricing_symbols"

const withCurrencyConverter = Component => 
    class extends React.Component {
        getPriceForCurrentCurrency = (prices, currentCurrency) => {
            var amount = 0
            prices.forEach(price => {
                if(price.currency === currentCurrency) {
                    amount = price.amount;
                } 
            })
    
            return PRICING_SYMBOLS[currentCurrency] + " " + amount 
        }

        render() { 
            return <Component currencyConverter={this.getPriceForCurrentCurrency}/>
        }
    }

export default withCurrencyConverter
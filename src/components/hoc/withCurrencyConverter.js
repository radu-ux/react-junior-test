import React from "react"
import { PRICING_SYMBOLS } from "../../util/pricing_symbols"

const withCurrencyConverter = Component => 
    class extends React.Component {
        priceToString = (prices, currentCurrency) => {
            var amount = 0
            prices.forEach(price => {
                if(price.currency === currentCurrency) {
                    amount = price.amount;
                } 
            })
    
            return PRICING_SYMBOLS[currentCurrency] + " " + amount
        }

        getAmountForCurrency = (prices, currentCurrency) => { 
            var amount = 0
            prices.forEach(price => {
                if(price.currency === currentCurrency) {
                    amount = price.amount;
                } 
            })
    
            return amount
        }

        render() { 
            return <Component priceToString={this.priceToString} getAmountForCurrency={this.getAmountForCurrency}/>
        }
    }

export default withCurrencyConverter
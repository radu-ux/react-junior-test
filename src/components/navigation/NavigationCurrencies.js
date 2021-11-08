import React from 'react'
import CurrencyButtonArrow from '../../images/Vector.svg'
import { connect } from 'react-redux'
import { setCurrentCurrency } from "../../store/slices/currenciesSlice"
import { updateCurrency } from "../../store/slices/cartSlice"
import { PRICING_SYMBOLS } from '../../util/pricing_symbols'

class NavigationCurrencies extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            shouldCloseCurrencyOption: true
        }
    }
    
    componentDidMount() {
        this.setState({shouldCloseCurrencyOption: true})
    }

    render() {
        const {shouldCloseCurrencyOption } = this.state 

        return (
            <>
                <div className="change-currency-button">
                    <button onClick={this.showCurrencyOptions}>
                        <p>{PRICING_SYMBOLS[this.props.currentCurrency]}</p>
                        <img src={CurrencyButtonArrow} alt="currency-button-arrow" className={`${shouldCloseCurrencyOption ? "rotate-upwards":"rotate-backwards"}`} />
                    </button>
                </div>
                <div className={`currency-option-list ${shouldCloseCurrencyOption ? "close-currency-option":"open-currency-option"}`}>
                    {
                        this.props.currencies.map((currency, currencyKey) => { 
                            return (
                                <div key={currencyKey} className="change-currency-button">
                                    <button id={`${currency}`} onClick={this.changeCurrency}>{PRICING_SYMBOLS[currency] + " " + currency}</button>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }

    changeCurrency = (e) => {
        this.props.changeCurrentCurrency(e.target.id)
        this.props.updateCartCurrency(e.target.id)
        this.setState({shouldCloseCurrencyOption: true})
    }

    showCurrencyOptions = () => { 
        this.setState({shouldCloseCurrencyOption: !this.state.shouldCloseCurrencyOption})
    }
}

const mapStateToProps = state => ({
    currencies: state.currencies.currencies,
    currentCurrency: state.currencies.currentCurrency
})

const mapDispatchToProps = dispatch => ({ 
   changeCurrentCurrency: currency => dispatch(setCurrentCurrency(currency)) ,
   updateCartCurrency: currency => dispatch(updateCurrency(currency))
})

export default connect(mapStateToProps,mapDispatchToProps)(NavigationCurrencies)
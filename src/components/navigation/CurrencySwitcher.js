import React from 'react'
import CSSClassName from "../../util/css-class-name"
import CurrencyButtonArrow from '../../images/Vector.svg'
import withCurrency from '../hoc/withCurrency'
import { connect } from 'react-redux'
import { setStoreCurrency, setCurrencySwitcherState } from "../../store/slices/currenciesSlice"
import { setCartCurrency } from "../../store/slices/cartSlice"
import { PRICING_SYMBOLS } from '../../util/pricing_symbols'

class CurrencySwitcher extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            shouldShowCurrencyOptionList: this.props.currencySwitcherState
        }
        this.currencySwitcherWrapperRef = React.createRef()
    }
    
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutsideCurrencySwitcher)
    }

    componentDidUpdate(prevState) { 
        if(prevState.currencySwitcherState !== this.props.currencySwitcherState) { 
            this.setState({shouldShowCurrencyOptionList: this.props.currencySwitcherState})
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutsideCurrencySwitcher)
    }

    render() {
        return (
            <div ref={this.currencySwitcherWrapperRef}>
                {this.renderCurrencySwitcherButton()}
                {this.renderCurrencyOptionList()}
            </div>
        )
    }

    renderCurrencySwitcherButton = () => { 
        const classNameValue = this.state.shouldShowCurrencyOptionList ? CSSClassName.rotate_symbol_backwards : CSSClassName.rotate_symbol_upwards
        return (
            <div className="change-currency-button">
                <button onClick={this.showCurrencyOptions}>
                    <p>{PRICING_SYMBOLS[this.props.storeCurrency]}</p>
                    <img src={CurrencyButtonArrow} alt="currency-button-arrow" className={classNameValue} />
                </button>
            </div>
        )
    }

    renderCurrencyOptionList = () =>{
        const classNameValue = this.state.shouldShowCurrencyOptionList ? CSSClassName.open_currency_option : CSSClassName.close_currency_option
        return (
            <div className={`currency-option-list ${classNameValue}`}>
                {
                    this.props.currencies.map((currency, currencyIndex) => { 
                        return this.renderCurrency(currency, currencyIndex)
                    })
                }
            </div>
        )
    }

    renderCurrency = (currency, currencyIndex) => { 
        return (
            <div className="change-currency-button currency-list-button" key={currency + " " + currencyIndex}>
                <button id={`${currency}`} onClick={this.changeCurrency}>{PRICING_SYMBOLS[currency] + " " + currency}</button>
            </div>
        )
    }

    changeCurrency = event => {
        this.props.changeStoreCurrency(event.target.id)
        this.props.changeCartCurrency(event.target.id)
        this.props.setCurrencySwitcherState(false)
    }

    showCurrencyOptions = () => { 
        this.props.setCurrencySwitcherState(!this.props.currencySwitcherState)
    }

    handleClickOutsideCurrencySwitcher = event => { 
        if(this.currencySwitcherWrapperRef.current !== null)  { 
            if(!this.currencySwitcherWrapperRef.current.contains(event.target)) {
                this.props.setCurrencySwitcherState(false)
            }
        }
    }
}

const mapStateToProps = state => ({
    storeCurrency: state.currency.storeCurrency,
    currencySwitcherState: state.currency.currencySwitcherState
})

const mapDispatchToProps = dispatch => ({ 
   changeStoreCurrency: currency => dispatch(setStoreCurrency(currency)),
   changeCartCurrency: currency => dispatch(setCartCurrency(currency)),
   setCurrencySwitcherState: state => dispatch(setCurrencySwitcherState(state))
})

export default withCurrency(connect(mapStateToProps,mapDispatchToProps)(CurrencySwitcher))
import React from "react"
import Logo from '../../images/Logo.svg'
import NavigationCart from "./NavigationCart"
import NavigationCategories from "./NavigationCategories"
import NavigationCurrencies from "./NavigationCurrencies"

class MainNavigation extends React.PureComponent {
    render() {

        return (
            <header>
                <NavigationCategories />
                <img width="60" src={Logo} alt="store-logo" /> 
                <div className="options-nav">
                    <NavigationCurrencies />
                    <NavigationCart />
                </div>
            </header>
        )
    }
}


export default MainNavigation
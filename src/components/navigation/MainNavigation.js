import React from "react"
import Logo from '../../images/Logo.svg'
import NavigationCart from "./NavigationCart"
import NavigationCategories from "./NavigationCategories"
import CurrencySwitcher from "./CurrencySwitcher"
import styled from "styled-components"
import { connect } from "react-redux"
import "./styles/navigation.css"

const CustomHeader = styled.header`
    z-index: ${props => props.zIndex};
`

class MainNavigation extends React.PureComponent {
    render() {
        return (
            <CustomHeader zIndex={this.props.headerZIndex} className="app-header">
                <NavigationCategories />
                <img width="60" src={Logo} alt="store-logo" /> 
                <div className="options-nav">
                    <CurrencySwitcher />
                    <NavigationCart />
                </div>
            </CustomHeader>
        )
    }
}

const mapStateToProps = state => ({
    headerZIndex: state.backdrop.headerZIndex
})

export default connect(mapStateToProps)(MainNavigation)
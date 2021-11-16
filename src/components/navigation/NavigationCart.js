import React from 'react'
import EmptyCartBlack from '../../images/EmptyCartBlack.svg'
import TrashCan from '../../images/trash-can.svg'
import CSSClassName from '../../util/css-class-name'
import CartProductAttributes from '../shared/CartProductAttributes'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { increaseProductQuantity, decreaseProductQuantity, removeFromCart } from '../../store/slices/cartSlice'
import { setCurrencySwitcherState } from '../../store/slices/currenciesSlice'
import { setBackdropVisibility } from "../../store/slices/backdropSlice"
import { PRICING_SYMBOLS } from '../../util/pricing_symbols'

class NavigationCart extends React.Component { 
    
    constructor(props) { 
        super(props)
        this.state = {
            shouldShowCartContent: false
        }

        this.needToDisableScrolling = false
    }
    
    componentDidMount() { 
        this.setState({shouldShowCartContent: false})
    }
    
    componentWillUnmount() {
        document.removeEventListener("scroll", this.handleScrollbarDisabling)
    }

    render() { 

        return (
            <div className="store-cart-wrapper" onMouseEnter={this.showCartPreview} onMouseLeave={this.hideCartPreview} >
                {this.renderCartButton()}
                {this.renderCartContent()}
            </div>
        )
    }

    renderCartButton = () => {
        const storeCartBadgeVisibility = this.props.itemCounter === 0 ? CSSClassName.store_cart_badge_invisible : CSSClassName.store_cart_badge_visible
        return (
            <button className="store-cart" onClick={this.navigateToCart}>
                <img className="store-cart-logo" src={EmptyCartBlack} alt="store-cart"/>
                <div className={`store-cart-badge ${storeCartBadgeVisibility}`} > 
                    <p>{this.props.itemCounter}</p>
                </div>
            </button>
        )
    }

    renderCartContent = () => {
        const showCartClassName = this.state.shouldShowCartContent ? CSSClassName.show_cart_preview : CSSClassName.hide_cart_preview
        const itemCountText = this.props.cartProducts.length === 1 ? CSSClassName.item : CSSClassName.items

        return (
            <div className={`cart-preview ${showCartClassName}`}>
                <h3>My Bag: <span className="cart-products-count">{this.props.cartProducts.length} {itemCountText}</span></h3>
                <div className="cart-preview-product-container">
                    {this.renderProductsFromCart()}
                    <div className="cart-total-amount">
                        <h3>Total:</h3>
                        <h3>{PRICING_SYMBOLS[this.props.storeCurrency] + " " + this.props.totalCartAmount}</h3> 
                    </div>
                    <div className="cart-preview-action">
                        <button className="view-bag" onClick={this.navigateToCart}>View Bag</button>
                        <button className="check-out">Check Out</button>
                    </div>
                </div>
            </div>
        )
    }

    renderProductsFromCart = () => {
        const productsContainer =  this.props.cartProducts.map(product => {
            return this.renderProduct(product) 
        })
        return productsContainer
    }

    renderProduct = product => { 
        const key = this.getUniqueKeyForProduct(product)
        
        return (
            <div className="cart-preview-product" key={key}>
                <div className="cart-preview-product-details">
                    <div className="current-product-details-group">
                        <p>{product.productName}</p>
                        <p>{product.productBrand}</p>
                    </div>
                    <p>{PRICING_SYMBOLS[product.productCurrency] + " " + product.amountValue}</p>
                    <CartProductAttributes inCartPreview={true} attributes={product.productAttributes} key={product.id+" cart attributes"}/>
                </div>
                <button className="remove-from-cart-button remove-from-cart-preview-button"><img height="20" src={TrashCan} alt="trash-can" onClick={() => this.removeProductFromCart(product)}/></button>
                <div className="cart-preview-product-photo-and-quantity">
                    <div className="cart-preview-product-quantity">
                        <button onClick={() => this.increaseQuantity(product)}>+</button>
                        <h3>{product.productQuantity}</h3>
                        <button onClick={() => this.decreaseQuantity(product)}>-</button>
                    </div>
                    <img width="130" src={product.productPhoto} alt={product.productName}></img>
                </div>
            </div>
        )
    }

    getUniqueKeyForProduct = product => { 
        let key=""
        for(let attribute of product.productAttributes) { 
            key+= attribute.selectedItem
        }
        return key+product.productId
    }

    increaseQuantity = product => {
        this.props.increaseQuantity(product)
    }

    decreaseQuantity = product => {
        this.props.decreaseQuantity(product)
    }

    removeProductFromCart = product => { 
        this.props.removeProductFromCart(product)
    }

    showCartPreview = () => {
        this.setState({shouldShowCartContent: true})
        this.props.setCurrencySwitcherState(false)
        this.props.setBackdropVisibility("backdrop-blurred")
        document.body.classList.add("disable-scrolling")
    }

    hideCartPreview = () => {
        this.setState({shouldShowCartContent: false})
        this.props.setBackdropVisibility("backdrop-visible")
        document.body.classList.remove("disable-scrolling")
    }

    navigateToCart = () => { 
        this.props.history.push('/cart')
    }
}

const mapStateToProps = state => ({
    cartProducts: state.cart.products,
    itemCounter: state.cart.itemCounter,
    storeCurrency: state.currency.storeCurrency,
    totalCartAmount: state.cart.totalCartAmount
})

const mapDispatchToProps = dispatch => ({ 
    increaseQuantity: product => dispatch(increaseProductQuantity(product)),
    decreaseQuantity:  product => dispatch(decreaseProductQuantity(product)),
    removeProductFromCart: product => dispatch(removeFromCart(product)),
    setBackdropVisibility: visibility => dispatch(setBackdropVisibility(visibility)),
    setCurrencySwitcherState: state => dispatch(setCurrencySwitcherState(state))
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(NavigationCart))
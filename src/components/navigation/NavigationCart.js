import React from 'react'
import EmptyCartBlack from '../../images/EmptyCartBlack.svg'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { increaseProductQuantity, decreaseProductQuantity } from '../../store/slices/cartSlice'

class NavigationCart extends React.Component { 
    
    constructor(props) { 
        super(props)
        this.state = {
            shouldShowCartContent: false
        }
    }
    
    componentDidMount() { 
       this.setState({shouldShowCartContent: false})
    }
    
    render() { 
        const { shouldShowCartContent } = this.state

        return (
            <div onMouseEnter={this.showCartPreview} onMouseLeave={this.hideCartPreview} className="store-cart-wrapper">
                <button className="store-cart" onClick={this.navigateToCart}>
                    <img className="store-cart-logo" src={EmptyCartBlack} alt="store-cart"/>
                    <div className={`store-cart-number ${this.props.cart.length === 0 ? "store-cart-number-invisible" : "store-cart-number-visible" }`} > 
                        <p>{this.props.cart.length}</p>
                    </div>
                </button>
                <div className={`cart-preview ${shouldShowCartContent ? "show-cart-preview" : "hide-cart-preview"}`}>
                    <h3>My Bag: <span className="cart-products-count">{this.props.cart.length} {this.props.cart.length === 1 ? "item": "items"}</span></h3>
                    {this.renderCartContent()}
                </div>
            </div>
        )
    }

    renderCartContent = () => {
        const cartProducts = this.props.cart

        return (
            <div className="cart-preview-product-container">
                {cartProducts.map(product => { 
                    return (
                        <div className="cart-preview-product" key={product.id}>
                            <div className="cart-preview-product-details">
                                <div className="current-product-details-group">
                                    <p>{product.productName}</p>
                                    <p>{product.productBrand}</p>
                                </div>
                                <p>{product.productPrice}</p>
                                <div className="current-product-attributes cart-preview-attributes-wrapper">
                                {
                                    product.productAttributes.map(attribute => { 
                                        return (
                                            <div className="attribute-wrapper" key={attribute.id}>
                                                <h3 id={attribute.id} className="attribute-title">{attribute.name}:</h3>
                                                <div className="current-product-attributes-items">                                        
                                                    {
                                                        attribute.type !== "swatch" ?
                                                        attribute.items.map(item => {
                                                            return <p id={item.value} className={`${item.id === attribute.selectedItem ? "attribute-active-in-cart-preview" : ""}`} key={item.id} style={{cursor:"not-allowed"}}>{item.value}</p>
                                                        })
                                                        :
                                                        attribute.items.map(item => {
                                                            return <div id={item.value} className={`swatch ${item.value === attribute.selectedItem ? "swatch-attribute-active-in-cart-preview" : ""}`} key={item.id} style={{backgroundColor: `${item.value}`, cursor:"not-allowed"}} ></div>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })    
                                }
                            </div>
                            </div>
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
                })}
                <div className="cart-preview-action">
                    <button className="view-bag" onClick={this.navigateToCart}>View Bag</button>
                    <button className="check-out">Check Out</button>
                </div>
            </div>
        )
    }

    increaseQuantity = product => {
        this.props.increaseQuantity(product)
    }

    decreaseQuantity = product => {
        this.props.decreaseQuantity(product)
    }

    showCartPreview = () => {
        this.setState({shouldShowCartContent: true})
    }

    hideCartPreview = () => {
        this.setState({shouldShowCartContent: false})
    }

    navigateToCart = () => { 
        this.props.history.push('/cart')
    }
}

const mapStateToProps = state => ({
    cart: state.cart.products
})

const mapDispatchToProps = dispatch => ({ 
    increaseQuantity: product => dispatch(increaseProductQuantity(product)),
    decreaseQuantity:  product => dispatch(decreaseProductQuantity(product)),
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(NavigationCart))
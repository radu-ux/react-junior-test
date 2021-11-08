import React from 'react'
import TrashCan from '../images/trash-can.svg'
import { connect } from 'react-redux'
import { increaseProductQuantity, decreaseProductQuantity, removeFromCart } from '../store/slices/cartSlice'
import { PRICING_SYMBOLS } from '../util/pricing_symbols'

class Cart extends React.Component { 

    render() { 
        return (
            <div className="main-cart-container">
                <h1 className="cart-title title">Cart</h1>
                {this.props.cart.length === 0 ? <h2>Cart is currently empty</h2> : this.renderCartContent()}
            </div>
        )
    }

    renderCartContent = () => { 
        
        return (
            <div className="main-cart-product-container">
                {
                    this.props.cart.map(product => { 
                        return (
                            <div className="cart-preview-product main-cart-product-separator" key={product.id}>
                                <div className="main-cart-product-details">
                                    <div className="current-product-details-group">
                                        <div className="store-cart-heading">
                                            <h1 className="current-product-name">{product.productName}</h1>
                                            <button className="remove-from-cart-button"><img height="20" src={TrashCan} alt="trash-can" onClick={() => this.removeProductFromCart(product)}/></button>
                                        </div>
                                        <h2 className="current-product-brand">{product.productBrand}</h2>
                                    </div>
                                    <h3>{PRICING_SYMBOLS[product.productCurrency] + " " + product.amountValue}</h3>
                                    <div className="current-product-attributes">
                                    {
                                        product.productAttributes.map((attribute, attributeIndex) => { 
                                            return (
                                                <div key={attribute.id} className="attribute-wrapper">
                                                    <h3 id={attribute.id} className="attribute-title">{attribute.name}:</h3>
                                                    <div className="current-product-attributes-items">                                        
                                                        {
                                                            attribute.type !== "swatch" ?
                                                            attribute.items.map((item, itemIndex) => {
                                                                return <p id={item.value} key={itemIndex} className={`${item.id === attribute.selectedItem ? "attribute-active" : ""}`} key={item.id} style={{cursor:"not-allowed"}}>{item.value}</p>
                                                            })
                                                            :
                                                            attribute.items.map((item, itemIndex) => {
                                                                return <div id={item.value} key={itemIndex} className={`swatch ${item.value === attribute.selectedItem ? "swatch-attribute-active" : ""}`} key={item.id} style={{backgroundColor: `${item.value}`, cursor:"not-allowed"}} ></div>
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
                                    <img width="200" src={product.productPhoto} alt={product.productName}></img>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            
        )
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
}

const mapStateToProps = state => ({ 
    cart: state.cart.products
})

const mapDispatchToProps = dispatch => ({ 
    increaseQuantity: product => dispatch(increaseProductQuantity(product)),
    decreaseQuantity:  product => dispatch(decreaseProductQuantity(product)),
    removeProductFromCart: product => dispatch(removeFromCart(product))
})

export default connect(mapStateToProps,mapDispatchToProps)(Cart)
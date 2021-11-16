import React from 'react'
import TrashCan from '../images/trash-can.svg'
import CartProductAttributes from './shared/CartProductAttributes'
import { connect } from 'react-redux'
import { setCurrentCategory } from '../store/slices/categoriesSlice'
import { increaseProductQuantity, decreaseProductQuantity, removeFromCart } from '../store/slices/cartSlice'
import { PRICING_SYMBOLS } from '../util/pricing_symbols'

class Cart extends React.Component { 

    render() { 
        return this.renderCartContent()
    }

    componentDidMount() { 
        this.props.setCurrentCategory({})
    }

    renderCartContent = () => { 
        return (
            <>
                <div className="main-cart-container">
                    <h1 className="cart-title title">Cart</h1>
                    <div className="main-cart-product-container">
                        {this.props.cart.length === 0 ? <h2>Cart is currently empty</h2> : this.renderProductsFromCart()}
                        <div className="cart-total-amount">
                            <h3>Total:</h3>
                            <h3>{PRICING_SYMBOLS[this.props.storeCurrency] + " " + this.props.totalCartAmount}</h3> 
                        </div>
                    </div>
                </div>
                <div className={`backdrop ${this.props.backdropVisibility}`} />
            </>
        )
    }

    renderProductsFromCart = () => { 
        const products = this.props.cart.map(product => { 
            return this.renderProduct(product)
            })
        return products
    }

    renderProduct = product => {
        const key = this.getUniqueKeyForProduct(product)

        return (
            <div className="cart-preview-product main-cart-product-separator" key={key}>
                <div className="main-cart-product-details">
                    <div className="current-product-details-group">
                        <div className="store-cart-heading">
                            <h1 className="current-product-name">{product.productName}</h1>
                            <button className="remove-from-cart-button"><img height="20" src={TrashCan} alt="trash-can" onClick={() => this.removeProductFromCart(product)}/></button>
                        </div>
                        <h2 className="current-product-brand">{product.productBrand}</h2>
                    </div>
                    <h3>{PRICING_SYMBOLS[product.productCurrency] + " " + product.amountValue}</h3>
                    <CartProductAttributes inCartPreview={false} attributes={product.productAttributes}/>
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
}

const mapStateToProps = state => ({ 
    cart: state.cart.products,
    storeCurrency: state.currency.storeCurrency,
    totalCartAmount: state.cart.totalCartAmount,
    backdropVisibility: state.backdrop.backdropClassName
})

const mapDispatchToProps = dispatch => ({ 
    increaseQuantity: product => dispatch(increaseProductQuantity(product)),
    decreaseQuantity:  product => dispatch(decreaseProductQuantity(product)),
    removeProductFromCart: product => dispatch(removeFromCart(product)),
    setCurrentCategory: categoryName => dispatch(setCurrentCategory(categoryName))
})

export default connect(mapStateToProps,mapDispatchToProps)(Cart)
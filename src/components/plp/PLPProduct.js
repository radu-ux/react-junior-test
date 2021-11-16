import React from "react"
import CSSClassName from "../../util/css-class-name"
import EmptyCartWhite from "../../images//EmptyCartWhite.svg"
import withCartOperations from "../hoc/withCartOperations"
import OutOfStockBanner from "./OutOfStockBanner"
import { connect } from "react-redux"
import { addToCart, canRenderPLPCartForm, setCurrentProduct, initializeSelectedItemsForAttributes } from "../../store/slices/cartSlice"
import { setBackdropVisibility, setHeaderZIndex } from "../../store/slices/backdropSlice"

class PLPProduct extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {product: this.props.product, currency: this.props.storeCurrency}
    }

    componentDidUpdate(prevPros) { 
        if(prevPros.storeCurrency !== this.props.storeCurrency) { 
            this.setState({currency: this.props.storeCurrency})
        }
    }

    render() {
        const { product, currency } = this.state
        const productPrice = this.props.priceToString(product.prices, currency)

        return (
            <div className={`plp-clickable plp-product ${this.shouldAttachOutOfStockClass()}`}
                onClick={event => this.navigateToProductDetailPage(event, product)}>
                <img height="280" src={product.gallery[0]} alt={product.name} id={product.id} className="plp-clickable"></img>
                <div className="plp-clickable plp-product-details">
                    <h3 className="plp-clickable plp-product-full-name">{product.brand + " " + product.name}</h3>
                    <h3 className="plp-clickable plp-product-price">{productPrice}</h3>
                    <button className="plp-add-to-cart-btn" onClick={event => this.renderProductInformation(event, product)}>
                        <img src={EmptyCartWhite} alt="empty-cart-white"/>
                    </button>
                </div>
                {this.shouldDisplayOutOfStockBanner()}
            </div>
        )
    }

    renderProductInformation = event => { 
        const { product } = this.state
        const sourceOfAction = event.target

        if(!sourceOfAction.classList.contains(CSSClassName.product_category_clickable)) {   
            this.props.canRenderPLPCartForm(true)
            this.props.setCurrentProduct(product)
            this.props.setBackdropVisibility("backdrop-blurred")
            this.props.setHeaderZIndex(50)
            this.props.initializeSelectedItemsForAttributes()
            document.body.classList.add("disable-scrolling")
            window.scroll(0, 0)
        } 
    }

    shouldAttachOutOfStockClass = () => {
        const { product } = this.state
        return product.inStock ? CSSClassName.empty : CSSClassName.not_in_stock
    }

    shouldDisplayOutOfStockBanner = () => { 
        const { product } = this.state
        return product.inStock ? null : <OutOfStockBanner />
    }

    navigateToProductDetailPage = event => {
        const { product } = this.state
        const sourceOfAction = event.target 
        
        if(sourceOfAction.classList.contains(CSSClassName.product_category_clickable)) { 
            const categoryName  = this.props.category.name

            this.props.history.push(`/${categoryName}/${product.id}`)
        }
    }
}

const mapSateToProps = state => ({
    storeCurrency: state.currency.storeCurrency,
    currentProduct: state.cart.currentProduct,
})

const mapDispatchToProps = dispatch => ({ 
    canRenderPLPCartForm: shouldRender => dispatch(canRenderPLPCartForm(shouldRender)),
    setCurrentProduct: product => dispatch(setCurrentProduct(product)),
    setBackdropVisibility: visibility => dispatch(setBackdropVisibility(visibility)),
    initializeSelectedItemsForAttributes: () => dispatch(initializeSelectedItemsForAttributes()),
    addToCart: product => dispatch(addToCart(product)),
    setHeaderZIndex: zIndexValue => dispatch(setHeaderZIndex(zIndexValue))
})

export default withCartOperations(connect(mapSateToProps, mapDispatchToProps)(PLPProduct))
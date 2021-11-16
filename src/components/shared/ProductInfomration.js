import React from "react"
import DOMPurify from "dompurify"
import CSSClassName from "../../util/css-class-name"
import CartProductAttributes from '../shared/CartProductAttributes'
import withCartOperations from "../hoc/withCartOperations"
import ProductAttributes from "./ProductAttributes"
import { addToCart, initializeSelectedItemsForAttributes, setCurrentProduct } from "../../store/slices/cartSlice"
import { setBackdropVisibility, setHeaderZIndex } from "../../store/slices/backdropSlice"
import { TYPE_TEXT } from "../../util/constants"
import { connect } from "react-redux"

class ProductInformation extends React.Component { 
    constructor(props) { 
        super(props)
        this.selectedItemOfAttribute = {}
        this.productDetailWrapperRef = React.createRef()
    }

    componentDidMount() { 
        if(this.props.positionedAbsolute) { 
            document.addEventListener("mousedown", this.handleClickOutsideProductInformation)
        }
    }

    componentWillUnmount() { 
        if(this.props.positionedAbsolute) { 
            document.removeEventListener("mousedown", this.handleClickOutsideComponent)
        }
    }

    render() { 
        return this.props.currentProduct === null ? null : this.renderProductInformation()
    }

    renderProductInformation() {
        const positionedAbsoluteClassName = this.props.positionedAbsolute ? CSSClassName.position_absolute : ""
        const addToCartButtonClassName = this.props.currentProduct.inStock ? CSSClassName.in_stock_button : CSSClassName.out_of_stock_button
        const productAttributes = this.props.currentProduct.inStock ? <ProductAttributes selectedItemOfAttribute={this.selectedItemOfAttribute} attributes={this.props.currentProduct.attributes}/> : <CartProductAttributes inCartPreview={false} attributes={this.props.currentProduct.attributes}/>
        const sanitizer = DOMPurify.sanitize
        
        return (
            <div className={`current-product-details ${positionedAbsoluteClassName}`} ref={this.productDetailWrapperRef}>
                <div className="current-product-details-group">
                    <h1 className="current-product-brand">{this.props.currentProduct.brand}</h1>
                    <h2 className="current-product-name">{this.props.currentProduct.name}</h2>
                </div>
                {productAttributes}
                <div className="current-product-details-group">
                    <h3 className="attribute-title">Price:</h3>
                    <h3 className="current-product-price">{this.props.priceToString(this.props.currentProduct.prices, this.props.storeCurrency)}</h3>
                </div>
                <button className={addToCartButtonClassName} onClick={this.addProductToCart}>Add to cart</button>
                <div className="current-products-description" dangerouslySetInnerHTML={{__html: sanitizer(this.props.currentProduct.description)}}></div>
            </div>
        )
    }

    addProductToCart = () => { 
        if(this.props.currentProduct.inStock) {
            const productToAdd = this.props.prepareProductForCart(this.props.currentProduct, this.props.getAmountForCurrency, this.props.storeCurrency)
            const validationArray = this.isValidProduct()

            if(validationArray.length === 0) {
                this.props.addToCart(productToAdd)
                this.restoreSelectedItemsOfAttributes()
                this.props.initializeSelectedItemsForAttributes()
                if(this.props.positionedAbsolute) {
                    this.closePopUp()
                }
            } else { 
                alert(`Please specify value for: ${validationArray[0].id}`)    
            }
        } else { 
            return null
        }
        
    }

    isValidProduct = () => { 
        const validationArray = this.props.currentProduct.attributes.filter(attribute => attribute.selectedItem === null)
        return validationArray
    }

    restoreSelectedItemsOfAttributes(){ 
        this.props.currentProduct.attributes.forEach(attribute => { 
            const className = attribute.type === TYPE_TEXT ? CSSClassName.attribute_active : CSSClassName.swatch_attribute_active 
            this.selectedItemOfAttribute[attribute.id].classList.remove(className)
            this.selectedItemOfAttribute[attribute.id] = null
        })
    }

    handleClickOutsideProductInformation = event => { 
        if(this.productDetailWrapperRef.current !== null) {
            if(!this.productDetailWrapperRef.current.contains(event.target)) { 
                this.closePopUp()
            }
        }
    }

    closePopUp = () => {
        this.props.setCurrentProduct(null)
        this.props.setBackdropVisibility("backdrop-visible")
        this.props.setHeaderZIndex(70)
        document.body.classList.remove("disable-scrolling")
    }
}

const mapStateToProps = state => ({
    currentProduct: state.cart.currentProduct,
    storeCurrency: state.currency.storeCurrency,
    shouldRenderPLPAddToCartForm: state.cart.shouldRenderPLPAddToCartForm,
})

const mapDispatchToProps = dispatch => ({
    addToCart: product => dispatch(addToCart(product)),
    setCurrentProduct: product => dispatch(setCurrentProduct(product)),
    setBackdropVisibility: visibility => dispatch(setBackdropVisibility(visibility)),
    initializeSelectedItemsForAttributes: () => dispatch(initializeSelectedItemsForAttributes()),
    setHeaderZIndex: zIndexValue => dispatch(setHeaderZIndex(zIndexValue))
})


export default withCartOperations(connect(mapStateToProps, mapDispatchToProps)(ProductInformation))

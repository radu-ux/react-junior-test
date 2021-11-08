import React from "react"
import withCurrencyConverter from "./hoc/withCurrencyConverter"
import DOMPurify from "dompurify"
import { TYPE_TEXT, TYPE_SWATCH } from "../util/constants"
import { withRouter } from "react-router"
import { connect } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { compose } from "redux"

class ProductDetailPage extends React.Component {
    constructor(props) { 
        super(props)
        this.state = { 
            currentProduct: undefined,
            selectedAttributesItems: [],
            mainPhoto: 0
        }
    }

    componentDidMount() { 
        const productName = this.props.match.params.productName
        const product = this.findProductByName(productName)
        const attributes  = this.initializeSelectedAttributesForProduct(product) 
        this.setState({currentProduct: product, selectedAttributesItems: attributes})
    }

    render() { 
        const { currentProduct } = this.state

        return (currentProduct !== undefined) ? this.renderProductDetails() : null
    }

    renderProductDetails = () => { 
        const { currentProduct, mainPhoto } = this.state
        const sanitizer = DOMPurify.sanitize

        return (
            <div className="current-product-wrapper">
                <div className="current-product-gallery">
                    <div className={`${currentProduct.gallery.length > 3 ? "current-product-other-photos-greater-than-3": "current-product-other-photos-smaller-than-3"}`}>
                        {
                            currentProduct.gallery.map((photo, index) => { 
                                return <img onClick={() => this.choosePhoto(index)} src={photo} alt={`${currentProduct.name + index}`} className={`small-gallery-photo ${index === mainPhoto ? "photo-highlighted": null}`}  key={index}/>
                            })
                        }
                    </div>
                    <img src={currentProduct.gallery[mainPhoto]} alt={currentProduct.name} className="current-product-main-photo" />
                </div>
                <div className="current-product-details">
                    <div className="current-product-details-group">
                        <h1 className="current-product-brand">{currentProduct.brand}</h1>
                        <h2 className="current-product-name">{currentProduct.name}</h2>
                    </div>
                    <div className="current-product-attributes">
                        {
                            currentProduct.attributes.map(attribute => { 
                                return (
                                    <div className="attribute-wrapper" key={attribute.id}>
                                        <h3 id={attribute.id} className="attribute-title">{attribute.name}:</h3>
                                        <div className="current-product-attributes-items">                                        
                                            {
                                                attribute.type !== TYPE_SWATCH ?
                                                attribute.items.map(item => {
                                                    return <p onClick={(e) => this.chooseAttributeItem(e, attribute.id)} id={item.value} key={item.id} >{item.value}</p>
                                                })
                                                :
                                                attribute.items.map(item => {
                                                    return <div onClick={(e) => this.chooseAttributeItem(e, attribute.id)} id={item.value} key={item.id} className="swatch" style={{backgroundColor: `${item.value}`}} ></div>
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })    
                        }
                    </div>
                    <div className="current-product-details-group">
                        <h3 className="attribute-title">Price:</h3>
                        <h3 className="current-product-price">{this.props.currencyConverter(currentProduct.prices, this.props.currentCurrency)}</h3>
                    </div>
                    <button className="add-to-cart-button" onClick={this.addProductToCart}>Add to cart</button>
                    <div className="current-products-description" dangerouslySetInnerHTML={{__html: sanitizer(currentProduct.description)}}></div>
                </div>
            </div>
        )
    }

    isValidProduct = product => { 
        const validationArray = product.productAttributes.filter(attribute => attribute.selectedItem === undefined)
        return validationArray
    }

    addProductToCart = () => { 
        const productName = this.state.currentProduct.name
        const productBrand = this.state.currentProduct.brand
        const productPhoto = this.state.currentProduct.gallery[0]
        const productPrice = this.props.currencyConverter(this.state.currentProduct.prices, this.props.currentCurrency)
        const productAttributes = this.getProductAttributes(this.state.currentProduct)
        const productQuantity = 1
        const productPrices = this.state.currentProduct.prices
        const product = {productName, productBrand, productPhoto, productPrice, productQuantity, productPrices, productAttributes}
        const validationArray = this.isValidProduct(product)

        if(validationArray.length === 0) {
            this.props.addToCart(product)
            this.resetProductAttributesState()
        } else { 
            alert(`Please specify value for: ${validationArray[0].id}`)    
        }
    }

    resetProductAttributesState = () => {
        this.state.selectedAttributesItems.forEach(attribute => {
            if(attribute.item !== undefined ) {
                attribute.attributeType === TYPE_TEXT ? attribute.item.classList.remove("attribute-active") : attribute.item.classList.remove("swatch-attribute-active")
            }
            attribute.isChosen = false
            attribute.item = undefined
        })
    }

    getSelectedItemForAttribute = attributeId => { 
        var selectedItem = undefined
        this.state.selectedAttributesItems.forEach(attribute => { 
            if(attribute.isChosen && attribute.attributeId === attributeId) {
                selectedItem = attribute.item.id
            }
        })
        return selectedItem
    }

    getProductAttributes = product => { 
        const productAttributes = product.attributes.map(attribute => ({
            id: attribute.id,
            name: attribute.name,
            type: attribute.type,
            items: attribute.items,
            selectedItem: this.getSelectedItemForAttribute(attribute.id)
        }))

        return productAttributes
    }

    initializeSelectedAttributesForProduct = product => {
        const attributes = []
        product.attributes.forEach(attribute => {
            const attrObj = {attributeId: undefined, attributeType: undefined, item: undefined, isChosen: false} 
            attrObj.attributeId = attribute.id
            attrObj.attributeType = attribute.type
            attributes.push(attrObj)
        })
        return attributes
    }

    chooseAttributeItem = (e, attributeId) => {
        const attribute = this.state.selectedAttributesItems.find(attribute => attribute.attributeId === attributeId)
        const className = attribute.attributeType !== TYPE_SWATCH ? "attribute-active" : "swatch-attribute-active"
        if(!e.target.classList.contains(className) && !attribute.isChosen) {
            e.target.classList.add(className)
            attribute.isChosen = true
            attribute.item = e.target
        } else if(e.target.classList.contains(className) && attribute.isChosen) { 
            e.target.classList.remove(className)
            attribute.isChosen = false
            attribute.item = undefined
        } else if(!e.target.classList.contains(className) && attribute.isChosen) { 
            e.target.classList.add(className)
            attribute.item.classList.remove(className)
            attribute.item = e.target
        }
    }

    choosePhoto = index => { 
        this.setState({mainPhoto: index})
    }

    findProductByName = productName => {
        return this.props.currentCategory.products.find(product => product.name === productName)
    }
}

const mapStateToProps = state => ({ 
    currentCategory: state.categories.currentCategory,
    currentCurrency: state.currencies.currentCurrency
})

const mapDispatchToProps = dispatch => ({
    addToCart: product => dispatch(addToCart(product))
})

export default compose(withCurrencyConverter, withRouter)(connect(mapStateToProps, mapDispatchToProps)((ProductDetailPage)))
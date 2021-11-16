import React from "react"
import CSSClassName from "../../util/css-class-name"
import { TYPE_TEXT } from "../../util/constants"


const withCartOperations = WrappedComponent => class extends React.Component { 
    
    prepareProductForCart = (product, getAmountForCurrency, storeCurrency) => { 
        const productName = product.name
        const productBrand = product.brand
        const productId = product.id
        const productPhoto = product.gallery[0]
        const productCurrency = storeCurrency
        const amountValue = getAmountForCurrency(product.prices, storeCurrency)
        const productAttributes = product.attributes
        const productQuantity = 1
        const productPrices = product.prices
        const productToAdd = {productName, productBrand, productId, productPhoto, productQuantity, productCurrency, amountValue, productPrices, productAttributes}

        return productToAdd
    }
    
    chooseItemOfAttribute = (event, attribute, items, setSelectedItemOfAttribute) => {
        const className = attribute.type === TYPE_TEXT ? CSSClassName.attribute_active : CSSClassName.swatch_attribute_active
        if(event.target.classList.contains(className) && attribute.selectedItem === event.target.id) { 
            event.target.classList.remove(className)
            setSelectedItemOfAttribute(null, attribute.id)
        } else if (!event.target.classList.contains(className) && attribute.selectedItem !== null) {
            for(let item of items) { 
                if(item.id === attribute.selectedItem) { 
                    item.classList.remove(className)
                    break;
                }
            }
            event.target.classList.add(className)
            setSelectedItemOfAttribute(event.target.id, attribute.id)
       } else if(!event.target.classList.contains(className) && attribute.selectedItem === null) { 
            event.target.classList.add(className)
            setSelectedItemOfAttribute(event.target.id, attribute.id)
        }
    }

    getSiblingsOfElement = element => {
        let nextSibling = element.nextElementSibling
        let prevSibling = element.previousElementSibling
        let items = []
        while(nextSibling || prevSibling) { 
            if(nextSibling) {
                items.push(nextSibling)
                nextSibling = nextSibling.nextElementSibling
            }
            if(prevSibling) {
                items.push(prevSibling)
                prevSibling = prevSibling.previousElementSibling
            }
        }

        return items
    }

    render() { 
        return <WrappedComponent {...this.props} prepareProductForCart={this.prepareProductForCart} chooseItemOfAttribute={this.chooseItemOfAttribute} getSiblingsOfElement={this.getSiblingsOfElement}/>
    }
}

export default withCartOperations
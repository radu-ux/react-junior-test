import React from "react"
import CSSClassName from "../../util/css-class-name"
import styled from "styled-components"
import { TYPE_TEXT } from "../../util/constants"


const TextItemButton = styled.div`
    & p {
        cursor: not-allowed;
    }
`

const SwatchItemButton = styled.div`
    cursor: not-allowed;
    background-color: ${props => props.bgColor};
`

class CartProductAttributes extends React.Component { 
    render() {
        return this.renderAttributes()
    }

    renderAttributes = () => {
        const classNameValue = this.props.inCartPreview ? CSSClassName.in_cart_preview_attributes_wrapper : CSSClassName.attributes_wrapper

        return (
            <div className={classNameValue}>
                {
                    this.props.attributes.map(attribute => { 
                        return (
                            <div className="attribute-wrapper" key={attribute.id+" cart attributes wrapper"}>
                                <h3 id={attribute.id} className="attribute-title">{attribute.name}:</h3>
                                <div className="current-product-attributes-items" > 
                                    {this.renderItemsForAttribute(attribute)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    renderItemsForAttribute = attribute => { 
        return attribute.type === TYPE_TEXT ? this.renderTextItems(attribute) : this.renderSwatchItems(attribute)
    }

    renderTextItems = attribute => { 
        let attributeActiveClassName = ""
        if(this.props.inCartPreview) {
            attributeActiveClassName = CSSClassName.attribute_active_in_cart_preview
        } else { 
            attributeActiveClassName = CSSClassName.attribute_active
        }

        const itemsContainer = attribute.items.map(item => {
            const classNameValue = item.id === attribute.selectedItem ? attributeActiveClassName : CSSClassName.empty
            return(
                <TextItemButton key={item.id + " " + attribute.id}>
                    <p id={item.id} className={classNameValue}>{item.value}</p>
                </TextItemButton>
            )
        })

        return itemsContainer
    }

    renderSwatchItems = attribute => { 
        const itemsContainer = attribute.items.map(item => {
            const swatchWithBorder = item.id === "White" ? CSSClassName.swatch_with_border : ""
            const swatchAttributeActive = item.id === attribute.selectedItem ? CSSClassName.swatch_attribute_active_in_cart_preview : CSSClassName.empty
            const classNameValue = CSSClassName.swatch + " " + swatchWithBorder + " " + swatchAttributeActive
            return <SwatchItemButton id={item.id} key={item.id+" "+attribute.id} className={classNameValue} bgColor={item.value}></SwatchItemButton>
        })

        return itemsContainer
    }
}

export default CartProductAttributes
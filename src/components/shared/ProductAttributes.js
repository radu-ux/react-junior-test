import React from "react"
import CSSClassName from "../../util/css-class-name"
import withCartOperations from "../hoc/withCartOperations"
import { setSelectedItemOfAttribute} from "../../store/slices/cartSlice"
import { TYPE_TEXT } from "../../util/constants"
import { connect } from "react-redux"

class ProductAttributes extends React.Component { 
    render() {
        return this.rerenderAttributes()
    }

    rerenderAttributes = () => { 
        return (
            <div className={`current-product-attributes`}>
                {
                    this.props.attributes.map(attribute => { 
                        return (
                            <div className="attribute-wrapper" key={attribute.id}>
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
        const itemsContainer = attribute.items.map(item => {
            return <p onClick={(event) => this.chooseItemOfAttributeTest(event, attribute)} id={item.id} key={item.id+" "+attribute.id} >{item.value}</p>
        })

        return itemsContainer
    }

    renderSwatchItems = attribute => { 
        const itemsContainer = attribute.items.map(item => {
            const swatchWithBorder = item.id === "White" ? CSSClassName.swatch_with_border : ""
            const classNameValue = CSSClassName.swatch + " " + swatchWithBorder
            return <div onClick={(event) => this.chooseItemOfAttributeTest(event, attribute)} id={item.id} key={item.id+" "+attribute.id} className={classNameValue} style={{backgroundColor: `${item.value}`}} ></div>
        })

        return itemsContainer
    }

    chooseItemOfAttributeTest = (event, attribute) => {
        const items = this.props.getSiblingsOfElement(event.target)
        this.props.selectedItemOfAttribute[attribute.id] = event.target
        this.props.chooseItemOfAttribute(event, attribute, items, this.props.setSelectedItemOfAttribute)
    }
}

const mapDispatchToProps = dispatch => ({ 
    setSelectedItemOfAttribute: (selectedItemValue, attributeId) => dispatch(setSelectedItemOfAttribute({selectedItemValue: selectedItemValue, attributeId: attributeId})), 
})

export default withCartOperations(connect(null, mapDispatchToProps)(ProductAttributes))
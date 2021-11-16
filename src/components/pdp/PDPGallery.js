import React from "react"
import { connect } from "react-redux"
import CSSClassName from "../../util/css-class-name"

class PDPGallery extends React.Component {
    constructor(props) {     
        super(props)
        this.state = { 
            chosenImageIndex: 0
        }
    }

    render() { 
        return this.props.currentProduct === null ? null : this.renderProductGallery()
    }

    renderProductGallery() { 
        const mainPhotoClassName = "current-product-main-photo " + this.shouldAttachOutOfStockClass()

        return (
            <div className="current-product-gallery">
                {this.renderSideImages()}
                <img src={this.props.currentProduct.gallery[this.state.chosenImageIndex]} alt={this.props.currentProduct.name} className={mainPhotoClassName} />
            </div>
        )
    }

    renderSideImages = () => { 
        const classNameValue = this.props.currentProduct.gallery.length > 3 ? CSSClassName.number_of_photos_greater_than_3 : CSSClassName.number_of_photos_smaller_than_3
        return (
            <div className={classNameValue}>
                {
                    this.props.currentProduct.gallery.map((image, indexOfImage) => { 
                        return this.renderSmallImage(image, indexOfImage)
                    })
                }
            </div>
        )
    }

    renderSmallImage = (image, indexOfImage) => {
        const photoHighlighted = indexOfImage === this.state.chosenImageIndex ? CSSClassName.photo_highlighted : ""
        const classNameValue = "small-gallery-photo " + photoHighlighted + " " + this.shouldAttachOutOfStockClass()
        return <img onClick={() => this.choosePhoto(indexOfImage)} src={image} alt={`${this.props.currentProduct.name + indexOfImage}`} className={classNameValue}  key={indexOfImage}/>
    }

    choosePhoto = index => { 
        this.setState({chosenImageIndex: index})
    }

    shouldAttachOutOfStockClass = () => {
        return this.props.currentProduct.inStock ? CSSClassName.empty : CSSClassName.not_in_stock
    }

    shouldDisplayOutOfStockBanner = () => { 
        return this.props.currentProduct.inStock ? null : <h2 className="plp-not-in-stock-text">out of stock</h2>
    }
}

const mapStateToProps = state => ({
    currentProduct: state.cart.currentProduct,
})

export default connect(mapStateToProps)(PDPGallery)
import React from "react"
import ProductInformation from "../shared/ProductInfomration"
import PDPGallery from "./PDPGallery"
import withCurrencyConverter from "../hoc/withCurrencyConverter"
import withProductDetails from "../hoc/withProductDetails"
import { withRouter } from "react-router"
import { connect } from 'react-redux'
import { canRenderPLPCartForm, setCurrentProduct, initializeSelectedItemsForAttributes } from '../../store/slices/cartSlice'
import { compose } from "redux"
import { setCurrentCategory } from "../../store/slices/categoriesSlice"
import "./styles/pdp.css"

class ProductDetailPage extends React.Component {

    componentDidMount() {
        const urlCategory = this.props.match.params.categoryName
        const currentCategory = this.props.currentCategory
        
        if(urlCategory !== currentCategory) {
            this.props.setCurrentCategory(urlCategory)
        }    
        this.props.canRenderPLPCartForm(false)
        this.props.setCurrentProduct(this.props.product)
        this.props.initializeSelectedItemsForAttributes()
    
    }

    componentWillUnmount() { 
        this.props.setCurrentProduct(null)
    }

    render() {
        return (
            <div className="current-product-wrapper">
                <PDPGallery />
                <ProductInformation positionedAbsolute={false} priceToString={this.props.priceToString} getAmountForCurrency={this.props.getAmountForCurrency}/>
                <div className={`backdrop ${this.props.backdropVisibility}`} />
            </div>
        )
    }

}

const mapStateToProps = state => ({
    currentCategory: state.category.currentCategory,
    currentProduct: state.cart.currentProduct,
    backdropVisibility: state.backdrop.backdropClassName
})

const mapDispatchToProps = dispatch => ({
    setCurrentProduct: product => dispatch(setCurrentProduct(product)),
    initializeSelectedItemsForAttributes: () => dispatch(initializeSelectedItemsForAttributes()),
    canRenderPLPCartForm: shouldRender => dispatch(canRenderPLPCartForm(shouldRender)),
    setCurrentCategory: categoryName => dispatch(setCurrentCategory(categoryName))
})

export default compose(
    withRouter,
    withProductDetails,
    withCurrencyConverter
    )(connect(mapStateToProps, mapDispatchToProps)((ProductDetailPage)))
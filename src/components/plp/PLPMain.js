import React from "react"
import withCurrencyConverter from "../hoc/withCurrencyConverter"
import withCategory from "../hoc/withCategory"
import PLPProduct from  "./PLPProduct"
import ProductInformation from "../shared/ProductInfomration"
import { withRouter } from "react-router"
import { setCurrentCategory } from "../../store/slices/categoriesSlice"
import { canRenderPLPCartForm } from "../../store/slices/cartSlice"
import { connect } from "react-redux"
import { compose } from "redux"
import "./styles/plp.css"


class PLPMain extends React.Component {
 
    componentDidMount() { 
        this.props.setCurrentCategory(this.props.category.name)
    }

    componentDidUpdate(prevProps) { 
        const currentCategoryName = this.props.match.params.categoryName
        const prevCategoryName = prevProps.match.params.categoryName

        if(prevCategoryName !== currentCategoryName) { 
            if(currentCategoryName !== undefined) { 
                this.props.setCurrentCategory(currentCategoryName)
                this.props.canRenderPLPCartForm(false)
            }
        }
    }

    render() {
        return (
            <>
            <div className="plp-categories-wrapper">
                <div className="plp-category" >
                    <h1 className="plp-category-name title">{this.props.category.name}</h1>
                    <div className="plp-products-wrapper">
                        {this.renderProductsOfCategory()}
                    </div>
                </div>
            </div>
            <ProductInformation positionedAbsolute={true} priceToString={this.props.priceToString} getAmountForCurrency={this.props.getAmountForCurrency}/>
            <div className={`backdrop ${this.props.backdropVisibility}`} />
            </>
        )
    }

    renderProductsOfCategory = () => { 
        const productsOfCategory = this.props.category.products
        const productsContainer = productsOfCategory.map(product => {
            return (
                <PLPProduct {...this.props} product={product} key={product.id}/>
            )
        })

        return productsContainer
    }

    hasError() { 
        if(this.props.category === null) { 
            return true
        } 
        return false
    }
}

const mapStateToProps = state => ({
    storeCurrency: state.currency.storeCurrency,
    backdropVisibility: state.backdrop.backdropClassName
})

const mapDispatchToProps = dispatch => ({
    canRenderPLPCartForm: shouldRender => dispatch(canRenderPLPCartForm(shouldRender)),
    setCurrentCategory: categoryName => dispatch(setCurrentCategory(categoryName))
})

export default compose(
    withRouter,
    withCategory,
    withCurrencyConverter
    )(connect(mapStateToProps, mapDispatchToProps)(PLPMain)) 
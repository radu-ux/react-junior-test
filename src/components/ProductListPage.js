import React from "react"
import withCurrencyConverter from "./hoc/withCurrencyConverter"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { compose } from "redux"

class ProductListPage extends React.Component {

    render() {
        return  <div className="categories-wrapper">
            <div className="category" >
                <h1 className="category-name title">{this.props.currentCategory.name}</h1>
                <div className="products-wrapper">
                {
                    this.props.currentCategory.products.map((product, productKey) => { 
                        return (
                            <div className={`product ${product.inStock ? '' : 'not-in-stock'}`} key={productKey} onClick={() => product.inStock ? this.showProductDetailPage(product.name) : null}>
                                <img height="280" src={product.gallery[0]} alt={product.name} id={product.name}></img>
                                <div className="product-details">
                                    <h3 className="product-name">{product.name}</h3>
                                    <h3 className="product-price">{this.props.priceToString(product.prices, this.props.currentCurrency)}</h3>
                                </div>
                                {product.inStock ? null : <h2 className="not-in-stock-text">out of stock</h2>}
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </div>
    }

    showProductDetailPage = (productName) => {
        const currentCategory  = this.props.currentCategory
        this.props.history.push(`/${currentCategory.name}/${productName}`)
    }
}

const mapStateToProps = state => ({ 
    currentCategory: state.categories.currentCategory,
    currentCurrency: state.currencies.currentCurrency
})

export default compose(withCurrencyConverter, withRouter)(connect(mapStateToProps)(ProductListPage))
import React from "react"
import ProductDetailPage from "./ProductDetailPage"
import ProductListPage from "./ProductListPage"
import Layout from "./Layout"
import Cart from './Cart'
import { connect } from "react-redux"
import { Redirect, withRouter } from "react-router"
import { setCurrentCategory } from "../store/slices/categoriesSlice"
import PageNotfound from "./404"

class RouterReducer extends React.Component { 

    getDefaultCategoryName = () => {
        return this.props.categories[0].name
    }

    isCategoryValid = categoryName => { 
       const validationObj = this.props.categories.find(category => category.name === categoryName) 
       if(validationObj !== undefined) {
           return true
       } 

       return false
    }

    isProductFromCategoryValid = (categoryName, productName) => { 
        const category = this.props.categories.find(category => category.name === categoryName)
        console.log(category, productName)
        const productObj = category.products.find(product => product.name === productName)
        if(productObj !== undefined) {
            return true
        } 

        return false
    }

    componentDidUpdate(prevProps) { 
        console.log(prevProps)
        if(prevProps.areCategoriesFetched !== this.props.areCategoriesFetched || prevProps.match.params.category !== this.props.match.params.categoryName) { 
            const categoryName = this.props.match.params.categoryName
            if(categoryName !== undefined) { 
                this.props.updateCurrentCategory(categoryName)
            }
        }
    }

    render() { 
        const { categoryName, productName } = this.props.match.params
        console.log(this.props)
     
        if(this.props.match.path === '/') {
            return this.props.areCategoriesFetched ? <Redirect to={`/${this.getDefaultCategoryName()}`} /> : null
        } else if (this.props.match.path === '/cart') {
            return this.props.areCategoriesFetched ? <Layout><Cart /></Layout> : null
        } else if (categoryName !== undefined && productName === undefined) {
            
            if (this.props.areCategoriesFetched ) {
                if(this.props.currentCategory !== undefined) {
                    if(this.isCategoryValid(categoryName)) {
                        return <Layout><ProductListPage /></Layout>
                    }   
                }
                return <PageNotfound />
            } else {
                return null
            }
        } else if (categoryName !== undefined && productName !== undefined) {

            if(this.props.areCategoriesFetched) {
                if(this.props.currentCategory !== undefined) {
                    if(this.isProductFromCategoryValid(categoryName, productName)) {
                        return <Layout><ProductDetailPage /></Layout>
                    }   
                }
                return <PageNotfound />
            } else { 
                return null
            }
        } 
    }

}

const mapStateToProps = state => ({ 
    categories: state.categories.categories,
    currentCategory: state.categories.currentCategory,
    areCategoriesFetched: state.categories.areCategoriesFetched
})

const mapDispatchToProps = dispatch => ({ 
    updateCurrentCategory: categoryName => dispatch(setCurrentCategory(categoryName))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouterReducer))
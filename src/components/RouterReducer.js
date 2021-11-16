import React from "react"
import PDPMain from "./pdp/PDPMain"
import PLPMain from "./plp/PLPMain"
import Layout from "./Layout"
import Cart from './Cart'
import { connect } from "react-redux"
import { DEFAULT_CATEGORY_PAGE_ROUTE } from "../util/constants"
import { Redirect, withRouter } from "react-router"
import { setCurrentCategory } from "../store/slices/categoriesSlice"

class RouterReducer extends React.Component { 

    render() { 
        const { categoryName, productId } = this.props.match.params
        
        if(this.props.match.path === '/') {
            return <Redirect to={DEFAULT_CATEGORY_PAGE_ROUTE} />
        } else if (this.props.match.path === '/cart') {
            return <Layout><Cart /></Layout>
        } else if (categoryName !== undefined && productId === undefined) {
            return <Layout><PLPMain selectedCategory={categoryName}/></Layout>
        } else if (categoryName !== undefined && productId !== undefined) {
            return <Layout><PDPMain productId={productId}/></Layout>
        } 
    }

}


const mapDispatchToProps = dispatch => ({ 
    setCurrentCategory: categoryName => dispatch(setCurrentCategory(categoryName))
})

export default withRouter(connect(null, mapDispatchToProps)(RouterReducer))
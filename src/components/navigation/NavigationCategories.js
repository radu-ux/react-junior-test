import React from 'react'
import withCategoriesName from '../hoc/withCategoriesName'
import CSSClassName from '../../util/css-class-name'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

class NavigationCategories extends React.Component { 

    render() {
        return (
            <nav>
                <ul className="main-navigation">
                    {this.renderCategories()}
                </ul>
            </nav>
        )
    }

    renderCategories = () => { 
        const categories = this.props.categories.map((category, index) => {
            return this.renderCategory(category, index)
        })
        return categories
    }

    renderCategory = (category, index) => { 
        const categoryClassName = this.props.currentCategory !== undefined && category.name === this.props.currentCategory? CSSClassName.active_category : CSSClassName.inactive_category
        return (
            <li key={category.name + " " + index}>
                <button onClick={() => this.navigateToCategory(category.name)} id={category.name + " " + index} className={categoryClassName}>{category.name}</button>
            </li>
        )
    }

    navigateToCategory = categoryName => {
        this.props.history.push(`/${categoryName}`)
    }
}

const mapStateToProps = state => ({ 
    currentCategory: state.category.currentCategory, 
})

export default compose(withCategoriesName, withRouter)(connect(mapStateToProps)(NavigationCategories))
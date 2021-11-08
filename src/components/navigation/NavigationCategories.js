import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

class NavigationCategories extends React.Component { 
    constructor(props) { 
        super(props)
        this.state = { 
            categoryNames: [],
        }
    }

    componentDidMount() { 
        const categoryNames = this.props.categories.map(category => category.name)
        this.setState({categoryNames: categoryNames})
    }

    render() { 
        const { categoryNames } = this.state

        return (
            <nav>
                <ul className="main-navigation">
                    {categoryNames.map((categoryName, categoryKey) => {
                        return (
                            <li key={categoryKey}>
                                <button onClick={this.navigateToCategory} id={categoryName} className={`${this.props.currentCategory !== undefined && categoryName === this.props.currentCategory.name? "active-category" : "inactive-category"}`}>{categoryName}</button>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        )
    }

    navigateToCategory = (e) => {
        const categoryName = e.target.id
        this.props.history.push(`/${categoryName}`)
    }
}

const mapStateToProps = state => ({ 
    categories: state.categories.categories,
    currentCategory: state.categories.currentCategory, 
})

export default withRouter(connect(mapStateToProps)(NavigationCategories))
import React from "react"
import MainNavigation from "./navigation/MainNavigation"

class Layout extends React.Component { 
    render() {
        return ( 
            <>
                <MainNavigation />
                {this.props.children}
            </>
        )
    }
}

export default Layout
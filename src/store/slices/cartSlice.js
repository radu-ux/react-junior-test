import { createSlice } from "@reduxjs/toolkit";
import { PRICING_SYMBOLS } from "../../util/pricing_symbols";

const initialState = {
    products: []
}

const areAttributesTheSame = (cartProduct, currentProduct) => { 
    var areAttributesTheSame = true
    for(var i=0; i<cartProduct.productAttributes.length; i++) {
        if(cartProduct.productAttributes[i].selectedItem !== currentProduct.productAttributes[i].selectedItem) { 
            areAttributesTheSame = false
            break
        }
    }
    return areAttributesTheSame
}

const areProductsTheSame = (cartProduct, currentProduct) => { 
    var areProductsTheSame = false
    if(cartProduct.productName === currentProduct.productName) {
        if(areAttributesTheSame(cartProduct, currentProduct)) { 
            areProductsTheSame = true
        }
    }
    return areProductsTheSame
}

const getPriceForCurrentCurrency = (prices, newCurrency) => {
    var amount = 0
    prices.forEach(price => {
        if(price.currency === newCurrency) {
            amount = price.amount;
        } 
    })

    return PRICING_SYMBOLS[newCurrency] + " " + amount 
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => { 
            const currentProduct = action.payload
            if(state.products.length > 0) {
                var productAlreadyInCart = false
                for(var i=0; i<state.products.length; i++) { 
                    const cartProduct = state.products[i]
                    var areProductsEqual =false
                    if(areProductsTheSame(cartProduct, currentProduct)) { 
                        cartProduct.productQuantity++
                        productAlreadyInCart=true
                        areProductsEqual=true
                        break
                    }
                }
                if(!productAlreadyInCart || !areProductsEqual) { 
                    state.products.push(action.payload)
                }
            } else { 
                state.products.push(action.payload)
            }
            
        },

        removeFromCart: (state, action) => { 
            const indexOfProductInArray = state.products.indexOf(action.payload)
            state.products.splice(indexOfProductInArray, 1)
        },
        
        increaseProductQuantity: (state, action) => { 
            state.products.forEach(product => { 
                if(areProductsTheSame(product, action.payload)) { 
                    product.productQuantity++
                }
            })
        },

        decreaseProductQuantity: (state, action) => { 
            state.products.forEach(product => { 
                if(areProductsTheSame(product, action.payload) && product.productQuantity > 1) { 
                    product.productQuantity--
                }
            })
        },        

        updateCurrency: (state, action) => { 
            if(state.products.length > 0) {
                state.products.forEach(product => { 
                    product.productPrice = getPriceForCurrentCurrency(product.productPrices, action.payload)
                })
            }
        }
    }
})

export const { addToCart, removeFromCart, increaseProductQuantity, decreaseProductQuantity, updateCurrency } = cartSlice.actions
export default cartSlice.reducer
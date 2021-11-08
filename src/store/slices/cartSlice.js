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

const getInitialAmountForCurrency = (prices, currentCurrency) => {
    var amount = 0
    prices.forEach(price => { 
        if(price.currency === currentCurrency) {
            amount = price.amount
        }
    })

    return amount
}

const getCurrentAmountForCurrency = (prices, newCurrency, quantity) => { 
    const initialAmount = getInitialAmountForCurrency(prices, newCurrency)
    var newAmount = 0
    for(var i=0; i<quantity; i++) {
        newAmount += initialAmount
    }

    return newAmount
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
                        cartProduct.amountValue += getInitialAmountForCurrency(action.payload.productPrices, action.payload.productCurrency)
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
            const initialPrice = getInitialAmountForCurrency(action.payload.productPrices, action.payload.productCurrency)
            state.products.forEach(product => { 
                if(areProductsTheSame(product, action.payload)) { 
                    product.productQuantity++
                    product.amountValue = parseFloat((product.amountValue + initialPrice).toFixed(2))
                }
            })
        },

        decreaseProductQuantity: (state, action) => { 
            const initialPrice = getInitialAmountForCurrency(action.payload.productPrices, action.payload.productCurrency)
            state.products.forEach(product => { 
                if(areProductsTheSame(product, action.payload) && product.productQuantity > 1) { 
                    product.productQuantity--
                    product.amountValue = parseFloat((product.amountValue - initialPrice).toFixed(2))
                }
            })
        },        

        updateCurrency: (state, action) => { 
            const newCurrency = action.payload
            if(state.products.length > 0) {
                state.products.forEach(product => { 
                    product.productCurrency = newCurrency
                    product.amountValue = getCurrentAmountForCurrency(product.productPrices, newCurrency, product.productQuantity) 
                })
            }
        }
    }
})

export const { addToCart, removeFromCart, increaseProductQuantity, decreaseProductQuantity, updateCurrency } = cartSlice.actions
export default cartSlice.reducer
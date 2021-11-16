import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    itemCounter: 0,
    shouldRenderPLPAddToCartForm: false,
    totalCartAmount: 0,
    currentProduct: null
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
            let newTotalCartAmount = state.totalCartAmount
            if(state.products.length > 0) {
                var productAlreadyInCart = false
                for(var i=0; i<state.products.length; i++) { 
                    const cartProduct = state.products[i]
                    var areProductsEqual =false
                    if(areProductsTheSame(cartProduct, currentProduct)) { 
                        cartProduct.productQuantity++
                        cartProduct.amountValue += getInitialAmountForCurrency(currentProduct.productPrices, currentProduct.productCurrency)
                        productAlreadyInCart=true
                        areProductsEqual=true
                        break
                    }
                }
                if(!productAlreadyInCart || !areProductsEqual) { 
                    state.products.push(currentProduct)
                    newTotalCartAmount += currentProduct.amountValue
                }
            } else { 
                state.products.push(currentProduct)
                newTotalCartAmount += currentProduct.amountValue
            }
            
            state.totalCartAmount = Number(newTotalCartAmount.toFixed(2))
            state.itemCounter++
        },

        removeFromCart: (state, action) => { 
            const productToRemove = action.payload
            const amountToSubtract = productToRemove.productQuantity * getInitialAmountForCurrency(productToRemove.productPrices, productToRemove.productCurrency)
            let currentTotalCartAmount = state.totalCartAmount
            let indexOfProductInArray = -1

            for(let i=0; i<state.products.length; i++) { 
                const product = state.products[i]
                if(product.productId === productToRemove.productId) {
                    indexOfProductInArray = i
                    break;
                }
            } 

            currentTotalCartAmount -= amountToSubtract
            state.totalCartAmount = Number(currentTotalCartAmount.toFixed(2))
            state.itemCounter -= productToRemove.productQuantity
            
            if(indexOfProductInArray !== -1) {
                state.products.splice(indexOfProductInArray, 1)   
            } 
        },
        
        increaseProductQuantity: (state, action) => { 
            let totalCartAmount = state.totalCartAmount
            state.products.forEach(product => { 
                if(areProductsTheSame(product, action.payload)) { 
                    product.productQuantity++
                    state.itemCounter++
                    totalCartAmount += product.amountValue
                }
            })
            state.totalCartAmount = Number(totalCartAmount.toFixed(2))
        },

        decreaseProductQuantity: (state, action) => { 
            let totalCartAmount = state.totalCartAmount
            state.products.forEach(product => { 
                if(areProductsTheSame(product, action.payload) && product.productQuantity > 1) { 
                    product.productQuantity--
                    state.itemCounter--
                    totalCartAmount -= product.amountValue
                }
            })
            state.totalCartAmount = Number(totalCartAmount.toFixed(2))
        },

        setCartCurrency: (state, action) => { 
            const newCurrency = action.payload
            if(state.products.length > 0) {
                let newTotalAmount = 0
                state.products.forEach(product => { 
                    const currentProductAmount = getCurrentAmountForCurrency(product.productPrices, newCurrency, product.productQuantity)
                    product.productCurrency = newCurrency
                    product.amountValue = getInitialAmountForCurrency(product.productPrices, newCurrency) 
                    newTotalAmount += Number(currentProductAmount.toFixed(2))
                })
                state.totalCartAmount = newTotalAmount
            }
        },

        canRenderPLPCartForm: (state, action) => { 
            state.shouldRenderPLPAddToCartForm = action.payload
        },

        setCurrentProduct: (state, action) => { 
            state.currentProduct = action.payload
        }, 

        initializeSelectedItemsForAttributes: state => {
            state.currentProduct.attributes.forEach(attribute => {
                attribute.selectedItem = null
            })
        },

        setSelectedItemOfAttribute: (state, action) => { 
            const { selectedItemValue, attributeId } = action.payload
            state.currentProduct.attributes.forEach(attribute => { 
                if(attribute.id === attributeId) { 
                    attribute.selectedItem = selectedItemValue
                }
            })
        }
    }
})

export const { addToCart, removeFromCart, increaseProductQuantity, decreaseProductQuantity, 
               setCartCurrency, canRenderPLPCartForm, setCurrentProduct, 
               initializeSelectedItemsForAttributes, setSelectedItemOfAttribute } = cartSlice.actions
export default cartSlice.reducer

export const sortItemNameASC = (a,b) => {
    if(a.itemName < b.itemName)
        return -1
    if(a.itemName > b.itemName)
        return 1
    return 0
}

export const sortItemNameDESC = (a,b) => {
    if(a.itemName < b.itemName)
        return 1
    if(a.itemName > b.itemName)
        return -1
    return 0
}

export const sortCategoryASC = (a,b) => {
    if(a.category < b.category)
        return -1
    if(a.category > b.category)
        return 1
    return 0
}

export const sortCategoryDESC = (a,b) => {
    if(a.category < b.category)
        return 1
    if(a.category > b.category)
        return -1
    return 0
}

export const sortCostASC = (a,b) => {
    if(a.cost < b.cost)
        return -1
    if(a.cost > b.cost)
        return 1
    return 0
}

export const sortCostDESC = (a,b) => {
    if(a.cost < b.cost)
        return 1
    if(a.cost > b.cost)
        return -1
    return 0
}

export const sortRevenueASC = (a,b) => {
    if(a.revenue < b.revenue)
        return -1
    if(a.revenue > b.revenue)
        return 1
    return 0
}

export const sortRevenueDESC = (a,b) => {
    if(a.revenue < b.revenue)
        return 1
    if(a.revenue > b.revenue)
        return -1
    return 0
}

export const sortItemRemainingASC = (a,b) => {
    if(a.itemRemaining < b.itemRemaining)
        return -1
    if(a.itemRemaining > b.itemRemaining)
        return 1
    return 0
}

export const sortItemRemainingDESC = (a,b) => {
    if(a.itemRemaining < b.itemRemaining)
        return 1
    if(a.itemRemaining > b.itemRemaining)
        return -1
    return 0
}
export const sortCategoryNameThASC = (a,b) => {
    if(a.categoryNameTh < b.categoryNameTh)
        return -1
    if(a.categoryNameTh > b.categoryNameTh)
        return 1
    return 0
}

export const sortCategoryNameThDESC = (a,b) => {
    if(a.categoryNameTh < b.categoryNameTh)
        return 1
    if(a.categoryNameTh > b.categoryNameTh)
        return -1
    return 0
}

export const sortCategoryNameEnASC = (a,b) => {
    if(a.categoryNameEn < b.categoryNameEn)
        return -1
    if(a.categoryNameEn > b.categoryNameEn)
        return 1
    return 0
}

export const sortCategoryNameEnDESC = (a,b) => {
    if(a.categoryNameEn < b.categoryNameEn)
        return 1
    if(a.categoryNameEn > b.categoryNameEn)
        return -1
    return 0
}
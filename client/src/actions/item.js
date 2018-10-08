import axios from 'axios'

export const fetchItems = (stockId) => async dispatch => {
    console.log(stockId)
    const res = await axios.get(`/api/item/${stockId}`);
    console.log(res)
}
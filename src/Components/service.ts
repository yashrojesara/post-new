import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://hn.algolia.com/api/v1/',
});

export const getPosts = async (pageNo: number) => {
    return await axiosInstance.get(`${'search_by_date?tags=story&page='}${pageNo}`)
}
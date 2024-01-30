import axios from 'axios'

export const fetcher = axios.create({
  baseURL: process.env.SERVER_API_URL,
})

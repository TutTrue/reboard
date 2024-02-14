'use server'
import axios from 'axios'
import { cookies } from 'next/headers'

export async function getToken() {
  return cookies().get('next-auth.session-token')?.value || cookies().get('__Secure-next-auth.session-token')?.value || ''
}

export const fetcher = axios.create({
  baseURL: process.env.SERVER_API_URL,
})

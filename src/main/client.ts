import createClient from 'openapi-fetch'
import type { paths } from './api'

const baseUrl = "http://localhost:5051/";

export const client = createClient<paths>({ baseUrl, credentials: 'include' })

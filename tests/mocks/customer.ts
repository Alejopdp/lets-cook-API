import { UserPassword } from "../../src/bounded_contexts/IAM/domain/user/UserPassword"

export const CUSTOMER_FIRST_NAME = "Alejo"
export const CUSTOMER_LAST_NAME = "Scotti"
export const CUSTOMER_PHONE = "634135817"
export const CUSTOMER_ADDRESS_NAME = "Vicent Blasco Ibañez 5"
export const CUSTOMER_ADDRESS_DETAILS = "Bloque 7, Escalera 2, Puerta 9"
export const CUSTOMER_LATITUDE = 39.4869251
export const CUSTOMER_LONGITUDE = -0.3298131
export const CUSTOMER_PASSWORD = UserPassword.create("Pass1234", false)
export const CUSTOMER_EMAIL = "alejoscotti@gmail.com"

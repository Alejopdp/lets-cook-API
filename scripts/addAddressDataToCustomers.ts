// To run from root, execute the following:
// npx ts-node scripts/addAddressDataToCustomers.ts

import axios from "axios"
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config"
import Geocode from "react-geocode";
import { Customer } from "../src/bounded_contexts/operations/domain/customer/Customer"
import { mongooseCustomerRepository } from "../src/bounded_contexts/operations/infra/repositories/customer"

Geocode.setApiKey("AIzaSyDfrf-ItSLCXubKnFjo6JqTN03-JUX5Zy8");
Geocode.setLanguage("es");
Geocode.setRegion("es");


const addAddressDataToCustomers = async () => {
    console.log("Connectig to db...")
    await connectToDatabase()
    console.log("Fetching customers...")
    const customers: Customer[] = await mongooseCustomerRepository.findAll()

    for (let customer of customers) {
        if (customer.shippingAddress?.city && customer.billingAddress?.city) continue
        console.log("Updating customer ", customer.email)
        await updateShipping(customer)
        await updateBilling(customer)

        console.log("Saving to db...")
        await mongooseCustomerRepository.save(customer)
        console.log("Updated customer: ", customer.shippingAddress)
    }

    // console.log(customers.slice(0, 10))
}

const updateShipping = async (customer: Customer) => {
    if (!customer.shippingAddress || !customer.shippingAddress.name) return

    const response = await getGeometry(customer.shippingAddress.name)
    const moreInformation = getFormattedAddressFromGoogle(response.results[0]?.address_components)

    customer.shippingAddress.city = moreInformation.city
    customer.shippingAddress.province = moreInformation.province
    customer.shippingAddress.postalCode = moreInformation.postalCode
    customer.shippingAddress.country = moreInformation.country

}

const updateBilling = async (customer: Customer) => {
    if (!customer.billingAddress || !customer.billingAddress.addressName) return
    const response = await getGeometry(customer.billingAddress?.addressName)
    const moreInformation = getFormattedAddressFromGoogle(response.results[0]?.address_components)

    customer.billingAddress.city = moreInformation.city
    customer.billingAddress.province = moreInformation.province
    customer.billingAddress.postalCode = moreInformation.postalCode
    customer.billingAddress.country = moreInformation.country

}


const getGeometry = async (address: string) => {
    // Get latitude & longitude from address.
    try {
        // 
        // const formattedAddress: string = address.split(" ").join("+")
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                key: "AIzaSyDfrf-ItSLCXubKnFjo6JqTN03-JUX5Zy8",
                address
            }
        })
        // const response = await Geocode.fromAddress(address);
        console.log("Repsonse: ", response.data)

        return response.data;
    } catch (error) {
        console.log("Error: ", error)
        return undefined;
    }
};

interface OtherAddressInformation { city: string, province: string, country: string, postalCode: string }

const getFormattedAddressFromGoogle = (address_components?: { long_name: string, short_name: string, types: string[] }[]): OtherAddressInformation => {
    if (!address_components) return {
        city: '',
        province: '',
        country: '',
        postalCode: ''

    }
    return {
        city: address_components.find(component => component.types.includes("locality"))?.long_name ?? "",
        country: address_components.find(component => component.types.includes("country"))?.long_name ?? "",
        province: address_components.find(component => component.types.includes("administrative_area_level_1"))?.long_name ?? "",
        postalCode: address_components.find(component => component.types.includes("postal_code"))?.long_name ?? ""
    }


}

addAddressDataToCustomers()
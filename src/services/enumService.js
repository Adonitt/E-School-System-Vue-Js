import client from "@/helpers/client.js";

class EnumService {
    async getCountries() {
        const res = await client.get('/enums/countries')
        return res.data;
    }

    async getCities(country) {
        const res = await client.get(`/enums/cities/${country}`)
        return res.data;
    }

}

export default new EnumService()
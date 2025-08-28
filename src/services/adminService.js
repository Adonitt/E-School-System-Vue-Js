import client from "@/helpers/client.js";

class AdminService {
    async getAllAdmins() {
        try {
            const res = await client.get('/admin')
            // console.log(res.data)
            return res.data
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getAdminById(id) {
        const res = await client.get(`/admin/${id}`)
        // console.log(res.data)
        return res.data
    }

}

export default new AdminService();
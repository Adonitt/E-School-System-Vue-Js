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

    async createAdmin(newAdmin) {
        const res = await client.post('/admin', newAdmin, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        return res.data;
    }

    async modifyAdmin(id, newAdmin) {
        const res = await client.put(`/admin/${newAdmin.id}`, newAdmin, {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        )
        return res.status === 200 ? res.data : null;
    }

    async removeAdmin(id) {
        const res = await client.delete(`/admin/${id}`)
        return res.data === 204
    }

}

export default new AdminService();
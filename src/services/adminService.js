import client from "@/helpers/client.js";
import axios from "axios";

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
        const res = await client.post('/admin/create', newAdmin, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        return res.data;
    }

    async modifyAdmin(id, newAdmin) {
        const res = await client.put(`/admin/modify/${id}`, newAdmin, {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        )
        return res.status === 200 ? res.data : null;
    }

    async removeAdmin(id) {
        const res = await client.delete(`/admin/${id}`)
        return res.data === 204
    }

    token = localStorage.getItem("token");

    async changePassword(data) {
        const res = await axios.post(
            "http://localhost:8080/api/v1/auth/change-password",
            data,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            }
        );
        return res.data;
    }


}

export default new AdminService();
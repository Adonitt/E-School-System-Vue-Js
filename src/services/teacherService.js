import client from "@/helpers/client.js";

class TeacherService {
    async getAllTeachers() {
        const res = await client.get('/teachers')
        return res.data;
    }

    async getTeacherById(id) {
        const res = await client.get(`/teachers/${id}`)
        return res.data;
    }

    async createTeacher(newTeacher) {
        const res = await client.post('/teachers/create', newTeacher, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        return res.data;
    }

    async modifyTeacher(id, newTeacher) {
        const res = await client.put(`/teachers/modify/${id}`, newTeacher, {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        )
    }

    async removeTeacher(id) {
        const res = await client.delete(`/teachers/${id}`)
        return res.data === 204
    }

}

export default new TeacherService()
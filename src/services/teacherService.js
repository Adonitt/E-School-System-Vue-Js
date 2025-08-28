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
}

export default new TeacherService()
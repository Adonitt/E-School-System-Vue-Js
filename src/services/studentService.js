import client from "@/helpers/client.js";

class StudentService {

    async getAllStudents() {
        const res = await client.get('/students')
        return res.data;
    }

    async getStudentById(id) {
        const res = await client.get(`/students/${id}`)
        return res.data;
    }
}

export default new StudentService()
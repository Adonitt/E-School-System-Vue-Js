import client from "@/helpers/client.js";

class SubjectService {
    async getAllSubjects() {
        const res = await client.get('/subjects')
        return res.data;
    }

    async getSubjectById(id) {
        const res = await client.get(`/subjects/${id}`)
        return res.data;
    }
}

export default new SubjectService()
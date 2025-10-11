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

    async createSubject(newSubject) {
        const res = await client.post('subjects/create', newSubject);
        return res.data;
    }

    async modifySubject(id, newSubject) {
        const res = await client.put(`/subjects/modify/${id}`, newSubject);
        return res.status === 200 ? res.data : null;
    }

    async deleteSubject(id) {
        const res = await client.delete(`/subjects/${id}`)
        return res.data === 204
    }

    async getAllClassNumbers() {
        const res = await client.get('/subjects/class-numbers')
        return res.data;
    }


}

export default new SubjectService()
import client from "@/helpers/client.js";

class GradesService {
    async getAllGrades() {
        const res = await client.get('/grades')
        return res.data;
    }

    async getGradeById(id) {
        const res = await client.get(`/grades/${id}`)
        return res.data;
    }

    async createGrade(grade) {
        const res = await client.post('/grades/add', grade)
        return res.data;
    }

    async modifyGrade(id, grade) {
        const res = await client.put(`/grades/update/${id}`, grade)
        return res.data;
    }

    async deleteGrade(id) {
        const res = await client.delete(`/grades/${id}`)
        return res.data === 204
    }

    async getGradesBySubjectId(subjectId) {
        const res = await client.get(`/grades/by-subject/${subjectId}`)
        return res.data;
    }

}

export default new GradesService()
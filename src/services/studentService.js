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

    async createStudent(newStudent) {
        const res = await client.post('/students/create', newStudent, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        return res.data;
    }

    async modifyStudent(id, newStudent) {
        const res = await client.put(`/students/modify/${id}`, newStudent, {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        )
        return res.status === 200 ? res.data : null;
    }

    async deactivateStudent(id) {
        const res = await client.post(`/students/deactivate-student/${id}`)
        return res.data;
    }

    async activateStudent(id) {
        const res = await client.post(`/students/activate-student/${id}`)
        return res.data;
    }

    async getStudentByClassNumber(classNumber) {
        const res = await client.get(`/students/students-by-class/${classNumber}`)
        return res.data;
    }


}

export default new StudentService()
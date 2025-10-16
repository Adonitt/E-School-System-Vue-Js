import client from "@/helpers/client.js";

class AttendanceService {

    async getAllAttendances() {
        const res = await client.get('/attendance')
        return res.data;
    }

    async getAttendanceById(id) {
        const res = await client.get(`/attendance/${id}`)
        return res.data;
    }

    async addAttendance(attendance) {
        const res = await client.post('/attendance/create', attendance)
        return res.data;
    }

    async updateAttendance(id, attendance) {
        const res = await client.put(`/attendance/modify/${id}`, attendance)
        return res.data;
    }

    async deleteAttendance(id) {
        const res = await client.delete(`/attendance/${id}`)
        return res.data === 204
    }

    async attendanceBySubjectId(subjectId) {
        const res = await client.get(`/attendance/subject/${subjectId}`)
        return res.data;

    }


}

export default new AttendanceService()
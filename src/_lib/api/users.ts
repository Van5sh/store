import { apiHandler } from "../ApiHandler"

const getUsers = async () => {
    const res = await apiHandler.get('/users')
}
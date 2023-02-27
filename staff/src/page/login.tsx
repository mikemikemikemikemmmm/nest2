import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loginApi, testTokenApi } from "../api/post"
import { dispatchError, dispatchSuccess } from "../utils/errorHandler"
import { getToken, setToken } from "../utils/token"

export const LoginPage = () => {

    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const handleLogin = async () => {
        if (!password || !name) {
            dispatchError('名稱與密碼不得為空')
            return
        }
        const { result, error } = await loginApi({ name, password })
        if (error) {
            return dispatchError(error)
        }
        setToken(result)
        dispatchSuccess('登入成功')
        navigate('/category')
    }
    const testToken = async () => {
        const { result, error } = await testTokenApi()
        if (result === true) {
            navigate('/category')
        }
    }
    useEffect(() => {
        testToken()
    }, [])
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: "center"
        }}>
            <div style={{ padding: 20 }}>
                <input type="text" style={{ display: 'block', padding: 10, margin: 10 }} placeholder="名稱" onChange={(e) => setName(e.target.value)} />
                <input type="password" style={{ display: 'block', padding: 10, margin: 10 }} placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
                <div style={{ textAlign: 'center' }}>
                    <button style={{ padding: 10, margin: 10, textAlign: 'center' }} onClick={() => handleLogin()}>
                        送出
                    </button>
                </div>
            </div>
        </div >
    )
}
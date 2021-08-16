import axios from 'axios'
import { useState } from 'react'

const useRequest = ({url, methos, body}) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async () => {
        setErrors(null)
        
        try {
            const response = await axios[method](url, body);

            return response.data
        } catch (error) {
            setErrors(
                <div className='alert alert-danger'>
                    <h4>Opss...!</h4>
                    <ul className='my-0'>
                    {error.response.data.errors.map((err) => (
                        <li key={err.message}>{err.message}</li>
                    ))}
                    </ul>
                </div>
            )
        }
    }

    return {doRequest, errors}
}

export default useRequest
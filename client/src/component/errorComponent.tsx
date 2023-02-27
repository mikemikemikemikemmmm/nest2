import { useNavigate } from 'react-router-dom'
import { PageContainer } from './PageContainer'
import ErrorImg from '/error.jpg'
export const ErrorComponent = () => {
    return <PageContainer>
        <div className="w-full h-full flex justify-center items-center">
            <img width={400} height={400} src={ErrorImg} alt="Error" />
        </div>
    </PageContainer>

}
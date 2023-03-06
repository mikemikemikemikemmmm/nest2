import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllNavApi } from './api/get'
import { RootState, setAllNavData } from './store'
import './style/index.css'
import { ErrorComponent } from './component/errorComponent'
function Wrapper(props: { children: JSX.Element }) {
  const dispatch = useDispatch()
  const allNavData = useSelector((state: RootState) => state.navSlice.allNavData)
  const [hasError, setHasError] = useState(false)
  const getAllNavData = async () => {
    const [result, error] = await getAllNavApi()
    if (error || !result) {
      setHasError(true)
      return
    }
    dispatch(setAllNavData(result.data.result))
  }
  useEffect(() => {
    getAllNavData()
  }, [])
  if (hasError) {
    return <div data-testid="wrapper-error"></div>
  }
  if (allNavData.length === 0) {
    return <div data-testid="wrapper-nodata"></div>
  }
  return (
    <div className="w-screen h-screen" data-testid="wrapper-success">
      {props.children}
    </div>
  )

}

export default Wrapper

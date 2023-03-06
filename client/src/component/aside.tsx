import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { ASIDE_WIDTH } from '../style/const'
export const Aside = () => {
    const loaderData = useLoaderData() as { navRoute: string }
    const navigate = useNavigate()
    const targetNavData = useSelector((state: RootState) => {
        const { allNavData } = state.navSlice
        return allNavData.find(nav => nav.route === loaderData.navRoute)
    })
    const targetNavRoute = targetNavData?.route
    useEffect(() => {
        if (!targetNavRoute) {
            navigate('/')
        }
    }, [targetNavRoute])
    if (!targetNavData) {
        return <div></div>
    }
    return (
        <aside className=" align-top inline-block list-none text-aside" style={{ width: ASIDE_WIDTH }} data-testid='asideComponent'>
            <ul>
                {
                    targetNavData.children
                        .filter(category => category.children.length > 0)
                        .map(category => <ul key={category.id}>
                            <li>
                                <h2 className='text-sm font-bold from-neutral-900'> {category.name}</h2>
                                <ul>
                                    {category.children.map(subcategory =>
                                        <li
                                            key={subcategory.id}
                                            className="my-2  hover:underline hover:text-asideHover">
                                            <Link
                                                key={subcategory.id}
                                                to={`/${targetNavData.route}/${category.route}/${subcategory.route}`}>
                                                {`  > ${subcategory.name}`}
                                            </Link>
                                        </li>)}
                                </ul>
                            </li>
                        </ul>)
                }
            </ul>
        </aside>
    )
}
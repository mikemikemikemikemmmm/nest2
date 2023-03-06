import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink, useLoaderData, useParams } from 'react-router-dom'
import { NavData, getNavRouteByProductIdApi } from '../api/get'
import { RootState } from '../store'
import { NAV_HEIGHT } from '../style/const'
export const Nav = () => {
    const allNavData = useSelector((state: RootState) => state.navSlice.allNavData)
    const loaderData = useLoaderData() as { navRoute: string | undefined }
    return (
        <nav className="w-full flex items-end h-24 mb-4" data-testid='navComponent'>
            <Link to={'/'} style={{ fontSize: 48 }}>
                lativ
            </Link>
            <div className='pb-4 ml-24 text-lg'>
                {allNavData
                    .filter(nav => {
                        if (nav.children.length === 0) {
                            return false
                        }
                        if (nav.children.every(category => category?.children?.length === 0)) {
                            return false
                        }
                        return true
                    })
                    .map(nav => (
                        <NavLink data-testid='navComponent-linkBtn' style={{ backgroundColor: loaderData?.navRoute === nav.route ? '#F0EDE5' : 'white' }} key={nav.id} className={`inline-block w-32 text-center py-1 hover:bg-amber-300 hover:text-slate-800`} to={`/${nav.route}`}>
                            {nav.name}
                        </NavLink>))}
            </div>
        </nav>
    )
}
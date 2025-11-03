import React from 'react'
import { useSearchParams } from 'react-router'

function Header() {

    const [ searchParams , setSearchParams ] = useSearchParams()

    return (
        <div className='flex items-center justify-between'>
            <h1>Store Monitor</h1>

            <div>
                <input onChange={e => setSearchParams({ date: e.target.value })} type="date" placeholder="Filter by date" defaultValue={searchParams.get("date") || ""}/>
            </div>
        </div>
    )
}

export default Header
import React from 'react'
import { useSelector } from 'react-redux'

const Alertui = () => {
    const alerts = useSelector(state => state.alert)
    return (
        <div>
            {console.table(alerts)}
        </div>
    )
}

export default Alertui

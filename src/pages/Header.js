import { useEffect, useState } from "react"


function Header() {
    const [state, setState] = useState({
        name: "",
        email: ""
    })
    useEffect(() => {
        const user = localStorage.getItem('user')
        // console.log(JSON.parse(user))

        setState({
            name: JSON.parse(user).name,
            email: JSON.parse(user).email
        })

    }, [])
    return (
        <div className="main-header">
            <p>{state.name}</p>
            <p>{state.email}</p>
        </div>
    )
}

export default Header
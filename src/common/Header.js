import React from "react"

const Header = () => {
    return (
        <div style={styles}>
            <p style={styles.p}>dope chat :3</p>
            <p></p>
        </div>
    )
}
const styles = {
    width: "100%",
    backgroundColor: '#c7c6c5',
    padding: '20px',
    borderBottom:'1px solid grey',
    p:{
        textAlign:'center',
    },
}
export default Header

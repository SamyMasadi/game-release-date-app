import React from 'react'
import './Message.css'

function Message(props) {
    return (
        <div className={props.messageClass}><b>{props.message}</b></div>
    )
}

export default Message
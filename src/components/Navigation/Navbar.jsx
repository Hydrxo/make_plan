import './Navbar.css'
import React from 'react'

export default function Navbar() {
    return (
        <>
            <nav className="nav-bar">
                <div className="content">
                    <img src="https://th.wikipedia.org/wiki/%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C:Facebook_Logo_%282019%29.png" alt="" />
                </div>
                <div className="nav">
                    <div className="nav-item">
                        <ul>
                            <li><a href="/">HOME</a></li>
                            <li><a href="/planner">PLANNER</a></li>
                            <li><a href="/progress">PROGRESS</a></li>
                            <li><a href="/user">USER</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
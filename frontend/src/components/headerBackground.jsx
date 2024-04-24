import React from 'react'
import background from '../assets/img/background-2.png';
import logo from '../assets/img/logo.png';

const headerBackground = () => {
    return (
        <div className="bg-contain bg-top bg-no-repeat w-screen h-[280px] min-w-screen fixed left-0 top-0" style={{ backgroundImage: `url(${background})`, width: '100%' }}>
            <div className="flex justify-center items-center pt-[48px]">
                <img src={logo} alt="logo" className='' />
            </div>
        </div>
    )
}

export default headerBackground
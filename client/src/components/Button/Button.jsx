import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ href, onClick, children, text, colorClass }) => (
    <div className='mx-auto flex justify-center'>
        {href
? (
            <a
                href={href}
                rel='noopener noreferrer'
                className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 text-sm leading-normal tracking-[0.015em] ${colorClass}`}
            >
                <span className="truncate">{text || children}</span>
            </a>
        )
: (
            <button
                onClick={onClick}
                className={`flex  max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 text-sm leading-normal tracking-[0.015em] ${colorClass}`}
            >
                <span className="truncate">{text || children}</span>
            </button>
        )}
    </div>
)

Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string,
    colorClass: PropTypes.string,
}

export default Button

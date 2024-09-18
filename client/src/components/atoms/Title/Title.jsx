import PropTypes from 'prop-types'

function Title ({ children, className }) {
  return (

    <h2 className={`text-4xl mx-auto font-bold my-4 sm:mt-12 text-center ${className}`}>
      {children}
    </h2>
  )
}

Title.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

Title.defaultProps = {
  className: 'text-white'
}

export default Title

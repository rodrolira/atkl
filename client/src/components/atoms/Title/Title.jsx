import PropTypes from 'prop-types'

function Title ({ children }) {
  return (

    <h2 className='text-4xl mx-auto font-bold mt-12 mb-4 text-white text-center'>
      {children}
    </h2>
  )
}

Title.propTypes = {
  children: PropTypes.node
}

export default Title

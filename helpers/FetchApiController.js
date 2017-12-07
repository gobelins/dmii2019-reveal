import 'whatwg-fetch'

const objectify = request => request.then(data => data.json())
const handleErrors = request => request.catch(error => { throw error })

const get = (url, header) => objectify(handleErrors(fetch(url, header)))

export { get }
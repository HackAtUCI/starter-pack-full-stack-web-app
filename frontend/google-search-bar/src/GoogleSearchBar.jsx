import React from 'react'
import { Search, Mic } from 'lucide-react'
 
const sampleData = [
  {
    id: 1,
    title: 'New York Times',
    url: 'https://reactjs.org/',
  },
  {
    id: 2,
    title: 'CNN',
    url: 'https://developer.mozilla.org/',
  },
  {
    id: 3,
    title: 'AP News',
    url: 'https://stackoverflow.com/',
  },
  {
    id: 4,
    title: 'Google News',
    url: 'https://github.com/',
  },
  {
    id: 5,
    title: 'PBS',
    url: 'https://www.npmjs.com/',
  },
]


const GoogleSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
 
    const debounce = (func, delay) => {
        let timeoutId
        return (...args) => {
            clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
        }
    }

    const handleSearch = useCallback(
    debounce((term) => {
      if (term.trim() === '') {
        setSearchResults([])
      } else {
        const results = sampleData.filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase()),
        )
        setSearchResults(results)
      }
    }, 300),
    [],
)
 
  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, handleSearch])
 
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }
}
 
export default GoogleSearchBar
const axios = require('axios')
const baseUrl = 'https://swapi.co/api'
const _ = require('lodash')

module.exports = {
  people: async (req, res) => {
    let response = await Promise.all([
      axios.get(`${baseUrl}/people?page=1`),
      axios.get(`${baseUrl}/people?page=2`),
      axios.get(`${baseUrl}/people?page=3`),
      axios.get(`${baseUrl}/people?page=4`),
      axios.get(`${baseUrl}/people?page=5`),
      axios.get(`${baseUrl}/people?page=6`),
      axios.get(`${baseUrl}/people?page=7`),
      axios.get(`${baseUrl}/people?page=8`),
      axios.get(`${baseUrl}/people?page=9`),
    ])
    let people = response.reduce((acc, apiResponse) => {
      return [ ...acc, ...apiResponse.data.results ]
    }, [])

    let { sortBy } = req.query
    let sortOptions = ['name', 'height', 'mass']

    if (!sortBy || !sortOptions.includes(sortBy)) {
      return res.json(people)
    } else if (sortBy === 'name') {
      res.send(_.sortBy(people, 'name'))
    } else {
      res.send(_.orderBy(people, person => +person[sortBy]))
    }
  },
  planets: async (req, res) => {
    let response = await Promise.all([
      axios.get(`${baseUrl}/planets?page=1`),
      axios.get(`${baseUrl}/planets?page=2`),
      axios.get(`${baseUrl}/planets?page=3`),
      axios.get(`${baseUrl}/planets?page=4`),
      axios.get(`${baseUrl}/planets?page=5`),
      axios.get(`${baseUrl}/planets?page=6`),
      axios.get(`${baseUrl}/planets?page=7`),
    ])

    let planets = response.reduce((acc, apiResponse) => {
      return [ ...acc, ...apiResponse.data.results ]
    }, [])

    let data = await Promise.all(planets.map(async planet => {
      let residents = await Promise.all(planet.residents.map(async residentUrl => {
        let res = await axios.get(residentUrl)
        return res.data.name
      }))

      planet.residents = residents
      return planet
    }))

    res.send(data)
  }
}
import React, { Component } from 'react'
import { getLocations, addFavorite, getFavorites, searchLocations } from '../Utils/Api_Utils.js'

export default class Search_Page extends Component {
    state = {
        locations: [],
        favorites: [],
        search: ''
    }

    
  componentDidMount = async () => {
        const locations = await getLocations();
        this.setState({
            locations: locations
        })
  }
    
     fetchFavorites = async () => {
        const favorites = await getFavorites(this.props.user.token)
        console.log(this.state)
        this.setState({ favorites });
     }
    
    handleSearchChange = e => this.setState({ search: e.target.value })

    handleSubmit = async e => {
        e.preventDefault();

        await this.makeSearch()
    }

    makeSearch = async () => {
        const locations = await searchLocations(this.state.search);
        this.setState({ locations });
    }


    handleFavoritesClick = async (faveDog) => {
        console.log(faveDog, 'favedog');
        console.log(this.props.user.token)
        await addFavorite({
            name: faveDog.name, 
            categories: faveDog.categories, 
            review_count: faveDog.review_count, 
            price: faveDog.price, 
            transactions: faveDog.transactions, 
            url: faveDog.url, 
            image_url: faveDog.image_url, 
            is_closed: faveDog.is_closed, 
            rating: faveDog.rating,
            distance: faveDog.distance, 
            display_phone: faveDog.display_phone,  
            city: faveDog.location.city,
            zip_code: faveDog.location.zip_code,
            state: faveDog.location.state,
            display_address: faveDog.location.display_address
           
        }, this.props.user.token);
        
        await this.fetchFavorites();
    }

    isAFavorite = (location) => {
        if (!this.props.user.token) return true;
        
       const isIsAFavorite = this.state.favorites.find(favorite => favorite.name === location.name);

        return Boolean(isIsAFavorite);
    }

    render() {
        console.log(this.props, 'props')
        console.log(this.state, 'state')
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input value={this.state.search} onChange={this.handleSearchChange} />
                    <button>Search</button>
                </form>
                <div className='events'>
                    {
                        this.state.locations.map( (location, i) =>
                            <div key={`${location.name}-${i}`} >
                                <h2>{location.name}</h2>
                                <img alt={location.name} src={location.image_url} />
                                <p>{location.rating}</p>
                                <p>
                                    {this.isAFavorite(location)
                                        ? 'You love this dog'
                                        : <button onClick={() => this.handleFavoritesClick(location)} >add to favorites</button>
                                    }
                                </p>
                                
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}
 
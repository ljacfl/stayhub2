import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";


const PlacesPage = () => {

    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
        });
    }, []);

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-2 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Agregar nueva alojamiento
                </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map(place => (
                    <Link to={'/account/places/'+place._id} key={place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl" >
                        <div className="w-32 h-32 bg-gray-300 grow shrink-0">
                            {place.photos && place.photos.length > 0 && (
                                <img src={place.photos[0]} alt="" />
                            )}
                            
                        </div>

                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    )
}

export default PlacesPage;
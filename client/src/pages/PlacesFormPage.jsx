import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import { useState, useEffect } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";


const PlacesFormPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setredirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.addedPhotos);
            setDescription(data.description)
            setPerks(data.perks);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        })

    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function savePlace(ev) {
        ev.preventDefault();

        const placeData = {
            title, address, addedPhotos,
            description, perks, checkIn,
            checkOut, maxGuests, price,
        };

        if (id) {
            await axios.put('/places', {
                id, ...placeData
            });
            setredirect(true);
        } else {
            await axios.post('/places', placeData);
            setredirect(true);
        }

    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }


    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Titulo', 'Titulo del lugar de alojamiento.')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Campana del sol" />

                {preInput('Direccion', 'Dirección del lugar.')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} />

                {preInput('Fotos', 'Muestra tu alojamiento.')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />


                {preInput('Descripción', 'Descripción del lugar.')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

                {preInput('Lo que este lugar ofrece', 'Para una mejor experiencia del huesped.')}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {preInput('Check in/out', 'Agrega hora de entrada y salida.')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">

                    <div>
                        <h3 className="mt-2 -mb-1">Llegada:</h3>
                        <input type="text"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)}
                            placeholder="14" />
                    </div>

                    <div>
                        <h3 className="mt-2 -mb-1">Salida:</h3>
                        <input type="text"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}
                            placeholder="11" />
                    </div>

                    <div>
                        <h3 className="mt-2 -mb-1">Máximo de huespedes:</h3>
                        <input type="number" value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)} />
                    </div>

                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price}
                            onChange={ev => setPrice(ev.target.value)} />
                    </div>


                </div>

                <div>
                    <button className="primary my-4">Guardar</button>
                </div>


            </form>
        </div>
    )
}

export default PlacesFormPage;
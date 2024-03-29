import React from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import './browse.css'
import axios from 'axios';
import Card from "../components/Card"
import { useGetUserID } from "../hooks/useGetUserID";
import { useState, useEffect } from 'react'

export default function Browse() {

    const userID = useGetUserID();

    const [apartments, setApartments] = React.useState([]);
    const [savedApartments, setSavedApartments] = React.useState([]);
    const [markers, setMarkers] = React.useState([]);

    useEffect(() => {
        const fetchApartment = async () => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/apartments`);
                setApartments(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSavedApartment = async () => {
            try{
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/apartments//savedApartments/ids/${userID}`,
                    { userID }
                );
                setSavedApartments(response.data.savedApartments);
            } catch (err) {
                console.error(err);
            }
        };

        

        fetchApartment();
        
        if (userID) {
            fetchSavedApartment();
        }
    

    }, []);

    useEffect(() => {
        handleMarkers()
    }, [apartments])

    const handleMarkers = async () => {
        const newMarkers = [];

        await Promise.all(
            apartments.map(async (apartment) => {
                const geo = await getCoordinates(apartment.address);
                newMarkers.push({ position: geo, apartment });
            })
        );

    setMarkers(newMarkers);
};

    const getCoordinates = async (add) => {
        const address = add + " 15213";

        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${address}&limit=2&format=json`;
            const response = await axios.get(url);
            return([response.data[0].lat, response.data[0].lon])
        } catch (error) {
            console.error("Error retrieving coordinates:", error);
            return null;
        }
    }

    const isApartmentSaved = (id) => savedApartments.includes(id);

    return (
        <div>
            <h5>Please allow a few moments for the data to load.</h5>
            <MapContainer center={[40.431988,-79.959838]} zoom={15}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

            {markers.length > 0 && markers.map((marker, index) => (
                <Marker key={index} position={marker.position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                    <Popup>
                    <Card
                        key={marker.apartment._id}
                        id={marker.apartment._id}
                        address={marker.apartment.address}
                        imgUrl={marker.apartment.imageUrl}
                        rating={marker.apartment.rating}
                        comments={marker.apartment.comments}
                        description={marker.apartment.description}
                        isSaved={userID ? isApartmentSaved(marker.apartment.id) : false}
                    />
                    </Popup>
                
                </Marker>
            ))}

            </MapContainer>
        </div>
    )
}
"use client";

import { useContext } from "react";

import AppContext from "@/context/AppContext";

import { GoogleMap, MarkerF, Polyline } from "@react-google-maps/api";

export default function Completed() {
    const {
        session: { history, score }
    } = useContext(AppContext);

    return (
        <>
            <GoogleMap
                id="street-view"
                mapContainerStyle={{
                    zIndex: 100,
                    width: "100vw",
                    height: "50vh"
                }}
                center={{ lat: 0, lng: 0 }}
                zoom={2}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true
                }}
            >
                {history.map(
                    ({
                        correctPos,
                        selectedPos
                    }: {
                        correctPos: { lat: number; lng: number };
                        selectedPos: { lat: number; lng: number };
                    }) => (
                        <>
                            <MarkerF
                                position={{
                                    lat: correctPos.lat,
                                    lng: correctPos.lng
                                }}
                                options={{
                                    icon: {
                                        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                                    }
                                }}
                            />
                            <MarkerF
                                position={{
                                    lat: selectedPos.lat,
                                    lng: selectedPos.lng
                                }}
                            />
                            <Polyline
                                path={[
                                    {
                                        lat: correctPos.lat,
                                        lng: correctPos.lng
                                    },
                                    {
                                        lat: selectedPos.lat,
                                        lng: selectedPos.lng
                                    }
                                ]}
                            />
                        </>
                    )
                )}
            </GoogleMap>
            <p className="mt-2 text-2xl text-center">
                Final Score: {score} / 20000
            </p>
        </>
    );
}

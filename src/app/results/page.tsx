"use client";

import { useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
    GoogleMap,
    LoadScript,
    MarkerF,
    Polyline
} from "@react-google-maps/api";
import { convertDistance, getDistance } from "geolib";

import AppContext from "@/context/AppContext";

import ProgressBar from "@/components/ProgressBar";

export default function Results() {
    const router = useRouter();
    const [distance, setDistance] = useState(0);

    const {
        session,
        session: { selectedPos, correctPos, score, index, history },
        setSession
    } = useContext(AppContext);

    const calculateDistance = () => {
        return selectedPos ? convertDistance(distance, "km").toFixed(2) : 0;
    };

    const calculateScore = (): number => {
        if (!selectedPos) return 0;

        return Math.floor(Math.max(5000 - distance / 250, 0));
    };

    const handleNextRound = () => {
        // 5 rounds
        if (index > 3) {
            setSession({
                ...session,
                score: score + calculateScore(),
                history: [...history, { correctPos, selectedPos }]
            });

            router.push("/completed");
            return;
        }

        setSession({
            ...session,
            selectedPos: null,
            correctPos: null,
            score: score + calculateScore(),
            index: index + 1,
            history: [...history, { correctPos, selectedPos }]
        });

        router.push("/");
    };

    useEffect(() => {
        setDistance(
            getDistance(
                {
                    latitude: selectedPos.lat,
                    longitude: selectedPos.lng
                },

                {
                    latitude: correctPos.lat,
                    longitude: correctPos.lng
                }
            )
        );
    }, []);

    return (
        correctPos && (
            <>
                <GoogleMap
                    id="street-view"
                    mapContainerStyle={{
                        zIndex: 100,
                        width: "100vw",
                        height: "50vh"
                    }}
                    center={{ lat: correctPos.lat, lng: correctPos.lng }}
                    zoom={12}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                        minZoom: 3
                    }}
                >
                    <MarkerF
                        position={{ lat: correctPos.lat, lng: correctPos.lng }}
                        options={{
                            icon: {
                                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            }
                        }}
                    />

                    {selectedPos && (
                        <MarkerF
                            position={{
                                lat: selectedPos.lat,
                                lng: selectedPos.lng
                            }}
                        />
                    )}

                    {selectedPos && (
                        <Polyline
                            path={[
                                { lat: correctPos.lat, lng: correctPos.lng },
                                { lat: selectedPos.lat, lng: selectedPos.lng }
                            ]}
                        />
                    )}
                </GoogleMap>

                <h1 className="mt-6 text-4xl text-center">
                    You were <b>{calculateDistance()} km</b> away!
                </h1>

                <h2 className="mt-5 text-2xl text-center">
                    {/* {selectedPos && (
                    <ProgressBar maxValue={calculateScore()} duration={1500} />
                )} */}
                    <p className="mt-2">Score: {calculateScore()} / 5000</p>
                </h2>

                <div className="flex items-center justify-center">
                    <button
                        onClick={handleNextRound}
                        className="bg-green-500 w-[25%] mt-4 h-12 text-white rounded-lg align-middle"
                    >
                        Next Round
                    </button>
                </div>
            </>
        )
    );
}

"use client";

import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {
    GoogleMap,
    StreetViewPanorama,
    MarkerF,
    useLoadScript
} from "@react-google-maps/api";
import Link from "next/link";

import AppContext from "../context/AppContext";
import { MoonLoader } from "react-spinners";

// Memo prevents the components from re-rendering when the child components re-render
const MemoizedMarker = memo(MarkerF);
const MemoizedGoogleMap = memo(GoogleMap);
const MemoizedStreetViewPanorama = memo(StreetViewPanorama);

const libraries = ["streetView", "core", "marker", "places"];

export default function Home() {
    const {
        setSession,
        session,
        session: { correctPos, score }
    } = useContext(AppContext);

    const [markerPosition, setMarkerPosition] = useState<any>(null);

    const [bigMap, setBigMap] = useState(false);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
        // @ts-ignore
        libraries
    });

    const setBigMapTrue = useCallback(() => {
        setBigMap(true);
    }, []);

    const setBigMapFalse = useCallback(() => {
        setBigMap(false);
    }, []);

    const streetViewOptions = useMemo(
        () => ({
            position: correctPos,
            visible: true,
            enableCloseButton: false,
            showRoadLabels: false,
            motionTracking: false,
            motionTrackingControl: false,
            pov: { heading: 100, pitch: 0 },
            addressControl: false,
            fullscreenControl: false,
            zoomControl: false
        }),
        [correctPos]
    );

    const mapContainerStyle = useMemo(
        () => ({
            zIndex: 100,
            width: bigMap ? "50%" : "25%",
            height: bigMap ? "50%" : "25%",
            position: "absolute",
            bottom: "70px",
            right: "5px",
            border: "1px solid black",
            flex: 1
        }),
        [bigMap]
    );

    const handleMapClick = useCallback(
        (e: any) => {
            setMarkerPosition({
                lat: e.latLng!.lat(),
                lng: e.latLng!.lng()
            });

            setSession((prevSession: any) => ({
                ...prevSession,
                selectedPos: {
                    lat: e.latLng!.lat(),
                    lng: e.latLng!.lng()
                }
            }));
        },
        [setSession]
    );

    const center = useMemo(
        () => markerPosition || { lat: 0, lng: 0 },
        [markerPosition]
    );

    const generateRandomLocation = () => {
        const urbanAreas = {
            "New York City": {
                westBound: -74.006,
                eastBound: -73.935,
                southBound: 40.689,
                northBound: 40.878
            },
            Tokyo: {
                westBound: 139.562,
                eastBound: 139.917,
                southBound: 35.564,
                northBound: 35.762
            },
            London: {
                westBound: -0.214,
                eastBound: 0.021,
                southBound: 51.384,
                northBound: 51.686
            },
            Paris: {
                westBound: 2.226,
                eastBound: 2.475,
                southBound: 48.807,
                northBound: 48.905
            },
            Beijing: {
                westBound: 116.349,
                eastBound: 116.537,
                southBound: 39.761,
                northBound: 39.971
            },
            "São Paulo": {
                westBound: -46.794,
                eastBound: -46.596,
                southBound: -23.655,
                northBound: -23.48
            },
            "Los Angeles": {
                westBound: -118.67,
                eastBound: -118.155,
                southBound: 33.703,
                northBound: 34.328
            },
            Mumbai: {
                westBound: 72.775,
                eastBound: 72.939,
                southBound: 18.889,
                northBound: 19.25
            },
            Moscow: {
                westBound: 37.498,
                eastBound: 37.723,
                southBound: 55.612,
                northBound: 55.913
            },
            "Mexico City": {
                westBound: -99.299,
                eastBound: -99.038,
                southBound: 19.201,
                northBound: 19.526
            }
        };

        // Get a random city from the urbanAreas object
        const cities = Object.keys(urbanAreas);
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const cityBounds = urbanAreas[randomCity as keyof typeof urbanAreas];

        // Generate random coordinates within the boundaries of the selected city
        const randomLat =
            Math.random() * (cityBounds.northBound - cityBounds.southBound) +
            cityBounds.southBound;
        const randomLng =
            Math.random() * (cityBounds.eastBound - cityBounds.westBound) +
            cityBounds.westBound;

        return { city: randomCity, lat: randomLat, lng: randomLng };
    };

    const hasStreetView = (
        lat: number,
        lng: number,
        callback: (status: boolean, coords?: any) => any
    ) => {
        const sv = new google.maps.StreetViewService();

        sv.getPanorama(
            { location: { lat, lng }, radius: 100000 },
            (data, status) => {
                if (status === "OK") {
                    callback(true, {
                        lat: data?.location?.latLng?.lat(),
                        lng: data?.location?.latLng?.lng()
                    });
                } else {
                    callback(false);
                }
            }
        );
    };

    const getRandomStreetViewCoords = (
        callback: (coords: { lat: number; lng: number }) => any
    ) => {
        function tryGenerate() {
            const coords = generateRandomLocation();

            hasStreetView(coords.lat, coords.lng, (hasView, correctCoords) => {
                if (hasView) {
                    callback(correctCoords);
                    return;
                }

                tryGenerate();
            });
        }

        tryGenerate();
    };

    useEffect(() => {
        if (isLoaded) {
            getRandomStreetViewCoords((coords) => {
                if (coords) {
                    setSession((prevSession: any) => ({
                        ...prevSession,
                        correctPos: coords
                    }));
                }
            });
        }
    }, [isLoaded]);

    return isLoaded ? (
        <>
            {/* This GoogleMap component does nothing and is only here because StreetViewPanorama requires it*/}
            <GoogleMap mapContainerStyle={{ width: "100%", height: "100vh" }}>
                <MemoizedStreetViewPanorama options={streetViewOptions} />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100vh",
                        position: "relative"
                    }}
                >
                    <h1
                        className="z-50 items-center justify-center text-2xl font-bold text-center text-white"
                        style={{
                            position: "absolute",
                            bottom: "calc(70px + 25%)",
                            right: "5px"
                        }}
                    >
                        Score: {score} / 25000
                    </h1>

                    {/* This GoogleMap component is the actual map in the bottom right corner*/}
                    <MemoizedGoogleMap
                        id="street-view"
                        // @ts-ignore
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={0}
                        onClick={handleMapClick}
                        options={{
                            disableDefaultUI: true,
                            zoomControl: true
                        }}
                        onMouseOver={setBigMapTrue}
                        onMouseOut={setBigMapFalse}
                    >
                        {markerPosition && (
                            <MemoizedMarker position={markerPosition} />
                        )}
                    </MemoizedGoogleMap>

                    <Link
                        href={{
                            pathname: "/results"
                        }}
                    >
                        <button
                            className={`${
                                markerPosition === null
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-500"
                            } w-96 h-6 rounded-lg text-white`}
                            style={{
                                zIndex: 200,
                                position: "absolute",
                                bottom: "40px",
                                right: "5px"
                            }}
                            disabled={markerPosition === null}
                        >
                            Submit
                        </button>
                    </Link>
                </div>
            </GoogleMap>
        </>
    ) : (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}
        >
            <MoonLoader />
        </div>
    );
}

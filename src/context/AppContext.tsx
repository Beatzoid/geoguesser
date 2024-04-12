import { createContext } from "react";

const AppContext = createContext<any>({
    session: {
        selectedPos: null,
        correctPos: {
            lat: 0,
            lng: 0
        },
        history: [],
        score: 0,
        index: 0
    },
    setSession: () => {}
});

export default AppContext;
